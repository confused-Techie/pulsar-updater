const Registry = require("winreg");
const shell = require("shelljs");
const utils = require("./utils.js");

async function determineWindowsChannel() {
  // We MUST check if installed via choco first. As in the registry
  let chocolateyInstall = await windows_chocoInstalled();

  let chocolateyInstallCheck = utils.checkInstall(chocolateyInstall, "Chocolatey Installation");

  if (typeof chocolateyInstallCheck === "string") {
    return chocolateyInstallCheck;
  }

  let userInstall = await windows_isUserInstalled();

  let userInstallCheck = utils.checkInstall(userInstall, "User Installation");

  if (typeof userInstallCheck === "string") {
    return userInstallCheck;
  }

  let machineInstall = await windows_isMachineInstalled();

  let machineInstallCheck = utils.checkInstall(machineInstall, "Machine Installation");

  if (typeof machineInstallCheck === "string") {
    return machineInstallCheck;
  }

  // Since we now know that Pulsar hasn't been installed, we should assume this
  // is a portable installation
  return "Portable Installation";
}

function windows_isUserInstalled() {
  return new Promise((resolve, reject) => {
    let userInstallReg = new Registry({
      hive: "HKCU",
      key: "\\SOFTWARE\\0949b555-c22c-56b7-873a-a960bdefa81f"
    });

    userInstallReg.keyExists((err, exists) => {
      if (err) {
        reject(err);
      }

      resolve(exists);
    });
  });
}

function windows_isMachineInstalled() {
  return new Promise((resolve, reject) => {
    let machineInstallReg = new Registry({
      hive: "HKLM",
      key: "\\SOFTWARE\\0949b555-c22c-56b7-873a-a960bdefa81f"
    });

    machineInstallReg.keyExists((err, exists) => {
      if (err) {
        reject(err);
      }

      resolve(exists);
    });
  });
}

function windows_chocoInstalled() {
  if (!shell.which("choco")) {
    return false;
  }

  let chocoCheck = shell.exec("choco list --local-only");

  if (chocoCheck.code !== 0) {
    return false;
  }

  if (chocoCheck.stdout.includes("pulsar")) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  determineWindowsChannel,
  windows_isUserInstalled,
  windows_isMachineInstalled,
  windows_chocoInstalled,
};
