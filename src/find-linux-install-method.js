const fs = require("fs");
const utils = require("./utils.js");

async function determineLinuxChannel() {
  let flatpakInstall = linux_flatpakInstalled();

  let flatpakInstallCheck = utils.checkInstall(flatpakInstall, "Flatpak Installation");

  if (typeof flatpakInstallCheck === "string") {
    return flatpakInstallCheck;
  }

  let debGetInstall = linux_debGetInstalled();

  let debGetInstallCheck = utils.checkInstall(debGetInstall, "Deb-Get Installation");

  if (typeof debGetInstallCheck === "string") {
    return debGetInstallCheck;
  }

  let nixInstall = linux_nixInstalled();

  let nixInstallCheck = utils.checkInstall(nixInstall, "Nix Installation");

  if (typeof nixInstallCheck === "string") {
    return nixInstallCheck;
  }

  let homebrewInstall = linux_homebrewInstalled();

  let homebrewInstallCheck = utils.checkInstall(homebrewInstall, "Home Brew Installation");

  if (typeof homebrewInstallCheck === "string") {
    return homebrewInstallCheck;
  }

  // We haven't been able to determine any package managers that installed Pulsar
  // So we will assume it was installed manually by the user. And allow them to do
  // so again.
  return "Manual Installation";

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
  linux_flatpakInstalled,
};
