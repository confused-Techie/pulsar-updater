const { CompositeDisposable } = require("atom");
let superagent;
let findInstallMethod;

class PulsarUpdater {
  activate() {
    this.disposables = new CompositeDisposable();
    this.cache = require("./cache.js");

    this.disposables.add(
      atom.commands.add('core', 'pulsar-updater:check-for-updates', () => {
        this.checkForUpdates();
      })
    );

  }

  deactivate() {
    this.disposables.dispose();
  }

  consumeStatusBar(statusBar) {

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

        let installMethod = await findInstallMethod();

        // Now we need to do something with our need to update and install channel
        // Maybe something on the status bar, a notification?

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

}

module.exports = new PulsarUpdater();
