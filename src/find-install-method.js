const { determineWindowsChannel } = require("./find-windows-install-method.js");
const { determineLinuxChannel } = require("./find-linux-install-method.js");
const { determineMacOSChannel } = require("./find-macos-install-method.js");


// This module will do whatever it can to determine the installation method.
// This doesn't just mean to determine what platform Pulsar is installed on
// this also means to determine what program installed it, and what variant
// of the Pulsar binary is in use.

async function main() {
  let returnValue = "";
  //if (atom.inDevMode()) {
  //  return "Developer Mode";
  //}

  if (process.platform === "win32") {
    returnValue = await determineWindowsChannel();
  } else if (process.platform === "darwin") {
    returnValue = await determineMacOSChannel();
  } else if (process.platform === "linux") {
    returnValue = await determineLinuxChannel();
  }
  // Unused aix, freebsd, openbsd, sunos, android

  return {
    platform: process.platform,
    arch: process.arch,
    installMethod: returnValue
  };
}


module.exports = main;
