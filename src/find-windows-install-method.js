const Registry = require("winreg");
const shell = require("shelljs");
const utils = require("./utils.js");

const WINDOWS_CHANNELS = [
  {
    string: "Chocolatey Installation",
    func: windows_chocoInstalled
    // We MUST check all package managers first on windows, as end installs are identical
  },
  {
    string: "winget Installation",
    func: windows_wingetInstalled
  },
  {
    string: "User Installation",
    func: windows_isUserInstalled
  },
  {
    string: "Machine Installation",
    func: windows_isMachineInstalled
  }
];

const WINDOWS_CHANNELS_FALLBACK = "Portable Installation";

async function determineWindowsChannel() {
  for (let i = 0; i < WINDOWS_CHANNELS.length; i++) {
    let channel = WINDOWS_CHANNELS[i];

    let install = await channel.func();

    let installCheck = utils.checkInstall(install, channel.string);

    if (typeof installCheck === "string") {
      return installCheck;
    }
  }

  // Since we now know that Pulsar hasn't been installed, we should assume this
  // is a portable installation
  return WINDOWS_CHANNELS_FALLBACK;
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

function windows_wingetInstalled() {
  if (!shell.which("winget")) {
    return false;
  }

  let wingetCheck = shell.exec("winget show Pulsar");

  if (wingetCheck.code !== 0) {
    return false;
  }

  if (wingetCheck.stdout.includes("Pulsar")) {
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
  windows_wingetInstalled,
};
