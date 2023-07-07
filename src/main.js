const { CompositeDisposable } = require("atom");
let superagent;
let findInstallMethod;

class PulsarUpdater {
  activate() {
    this.disposables = new CompositeDisposable();
    this.cache = require("./cache.js");

    this.disposables.add(
      atom.commands.add('application', 'pulsar-updater:check-for-updates', () => {
        this.checkForUpdates();
      }),
      atom.commands.add('application', 'pulsar-updater:clear-cache', () => {
        this.cache.empty("last-update-check");
        this.cache.empty(`installMethod.${atom.getVersion()}`);
      })
    );

    // Setup an event listener for something after the editor has launched
  }

  deactivate() {
    this.disposables.dispose();
    superagent = null;
    findInstallMethod = null;
    this.cache = null;
  }

  async checkForUpdates() {
    let cachedUpdateCheck = this.cache.getCacheItem("last-update-check");

    if (cachedUpdateCheck === null) {
      // Null means that there is no previous check, or the last check expired
      let latestVersion = await this.newestRelease();

      let shouldUpdate = atom.versionSatisfies(`>= ${latestVersion}`);

      if (shouldUpdate) {
        this.cache.setCacheItem("last-update-check", {
          latestVersion: latestVersion,
          shouldUpdate: shouldUpdate
        });

        findInstallMethod ??= require("./find-install-method.js");

        let installMethod =
          this.cache.getCacheItem(`installMethod.${atom.getVersion()}` ?? await findInstallMethod();

        this.cache.setCacheItem(`installMethod.${atom.getVersion()}`, installMethod);

        // Lets now trigger a notification to alert the user
        const dismissUntilNextLaunch = () => {
          // emptying the cache, will cause the next check to succeed
          this.cache.empty("last-update-check");
        };

        let objButtonForInstallMethod = this.getObjButtonForInstallMethod(installMethod);

        atom.notifications.addInfo('An update for Pulsar is available.', {
          detail: this.getNotificationText(installMethod, latestVersion),
          dismissable: true,
          buttons: [
            {
              text: "Dismiss"
            },
            {
              text: "Dismiss until next launch.",
              onDidClick: dismissUntilNextLaunch
            },
            // Below we optionally add a button for the install method. That may
            // open to a pulsar download URL, if available for installation method
            (typeof objButtonForInstallMethod === "object" && objButtonForInstallMethod)
          ]
        });

      } // else don't update, rely on cache set above
    } else {
      // We don't need to check for updates.
    }
  }

  async newestRelease() {
    superagent ??= require("superagent");

    let res = await superagent
      .get("https://api.github.com/repos/pulsar-edit/pulsar/releases")
      .set("Accept", "application/vnd.github+json")
      .set("User-Agent", "Pulsar.Pulsar-Updater");

    if (res.status !== 200) {
      // Lie and say it's something that will never update
      return "0.0.0";
    }

    // We can be fast and simply check if the top of the array is newer than our
    // current version. Since the return is ordered
    return res.body[0].tag_name;
  }

  getNotificationText(installMethod, latestVersion) {
    let returnText = `Pulsar ${latestVersion} is available.\n`;

    switch(installMethod.installMethod) {
      case "Developer Mode":
        returnText += "Since you're in developer mode, Pulsy trusts you know how to update. :)";
        break;
      case "Safe Mode":
        returnText += "Declining update suggestion since Pulsar is in Safe Mode.";
        break;
      case "Spec Mode":
        returnText += "Declining update suggestion since Pulsar is in Spec Mode.";
        break;
      case "Flatpak Installation":
        returnText += "Install the latest version by running `flatpak update`.";
        break;
      case "Deb-Get Installation":
        returnText += "Install the latest version by running `sudo deb-get update`.";
        break;
      case "Nix Installation":
        // TODO find nix update command
        returnText += "Install the latest version via Nix.";
        break;
      case "Home Brew Installation":
        returnText += "Install the latest version by running `brew upgrade pulsar`.";
        break;
      case "winget Installation":
        returnText += "Install the latest version by running `winget upgrade pulsar`.";
        break;
      case "Chocolatey Installation":
        returnText += "Install the latest version by running `choco upgrade pulsar`.";
        break;
      case "User Installation":
      case "Machine Installation":
      case "Portable Installation":
      case "Manual Installation":
      default:
        returnText += "Download the latest version from the Pulsar Website or GitHub.";
        break;
    }

    return returnText;
  }

  getObjButtonForInstallMethod(installMethod) {
    let returnObj = null;

    const openWeb = (e) => {
      e.preventDefault();
      shell.openExternal("https://github.com/pulsar-edit/pulsar/releases");
    };

    switch(installMethod.installMethod) {
      case "User Installation":
      case "Machine Installation":
      default:
        returnObj = {
          text: "Download from GitHub",
          onDidClick: openWeb
        };
        break;
    }

    return returnObj;
  }

}

module.exports = new PulsarUpdater();
