const fs = require("fs");
const shell = require("shelljs");
const utils = require("./utils.js");

const LINUX_CHANNELS = [
  {
    string: "Flatpak Installation",
    func: linux_flatpakInstalled
  },
  {
    string: "Deb-Get Installation",
    func: linux_debGetInstalled
  },
  {
    string: "Nix Installation",
    func: linux_nixInstalled
  },
  {
    string: "Home Brew Installation",
    func: linux_homebrewInstalled
  }
];

const LINUX_CHANNELS_FALLBACK = "Manual Installation";

async function determineLinuxChannel() {
  for (let i = 0; i < LINUX_CHANNELS.length; i++) {
    let channel = LINUX_CHANNELS[i];

    let install = await channel.func();

    let installCheck = utils.checkInstall(install, chennel.string);

    if (typeof installCheck === "string") {
      return installCheck;
    }
  }

  // We haven't been able to determine any package managers that installed Pulsar
  // So we will assume it was installed manually by the user. And allow them to do
  // so again.
  return LINUX_CHANNELS_FALLBACK;
}

function linux_homebrewInstalled() {
  if (!shell.which("brew")) {
    return false;
  }

  let homebrewCheck = shell.exec("brew list 'pulsar'");

  if (homebrewCheck.code !== 0) {
    return false;
  }

  if (homebrewCheck.stdout.includes("pulsar")) {
    return true;
  } else {
    return false;
  }
}

function linux_nixInstalled() {
  if (!fs.existsSync("/nix/store")) {
    return false;
  }

  if (!shell.which("find")) {
    // A little dishonest, but we need this to check if it exists so..
    return false;
  }

  shell.cd("/nix/store");

  let nixCheck = shell.exec('find -maxdepth 1 -name "*pulsar.nemo_action"');

  if (nixCheck.code !== 0) {
    return false;
  }

  if (nixCheck.stdout.includes("pulsar.nemo_action")) {
    return true;
  } else {
    return false;
  }
}

function linux_debGetInstalled() {
  if (!shell.which("deb-get")) {
    return false;
  }

  let debGetCheck = shell.exec("deb-get list --installed");

  if (debGetCheck.code !== 0) {
    return false;
  }

  if (debGetCheck.stdout.includes("pulsar")) {
    return true;
  } else {
    return false;
  }
}

function linux_flatpakInstalled() {
  //if (atom.applicationDelegate.getWindowLoadSettings().resourcePath !== "/app/Pulsar/reousrces/app.asar") {
  //  return false;
  //}

  //if (fs.existsSync(`${process.env.HOME}/.var/app/dev.pulsar_edit.Pulsar`)) {
  //  return true;
  //}

  if (process.env.FLATPAK_ID === "dev.pulsar_edit.Pulsar") {
    return true;
  } else {
    return false;
  }
}


module.exports = {
  determineLinuxChannel,
  linux_homebrewInstalled,
  linux_nixInstalled,
  linux_debGetInstalled,
  linux_flatpakInstalled,
};
