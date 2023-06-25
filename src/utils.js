
// Used to check each installation method function
function checkInstall(toCheck, returnString) {
  if (typeof toCheck === "boolean") {
    if (toCheck) {
      return returnString;
    }
  } else {
    // we won't error, just log
    console.log(toCheck);
  }
}

module.exports = {
  checkInstall,
};
