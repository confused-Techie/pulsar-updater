const shell = require("shelljs");

const MACOS_CHANNELS = [
  {
    string: "Home Brew Installation",
    func: macos_homebrewInstalled
  }
];

const MACOS_CHANNELS_FALLBACK = "Manual Installation";

async function determineMacOSChannel() {
  for (let i = 0; i < MACOS_CHANNELS.length; i++) {
    let channel = MACOS_CHANNELS[i];

    let install = await channel.func();

    let installCheck = utils.checkInstall(install, channel.string);

    if (typeof installCheck === "string") {
      return installCheck;
    }
  }

  return MACOS_CHANNELS_FALLBACK;
}

function macos_homebrewInstalled() {
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

module.exports = {
  determineMacOSChannel,
  macos_homebrewInstalled,
};
