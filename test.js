//const t = require("./src/find-install-method.js");
const t = require("./src/main.js");

(async () => {
  let f = await t.newestRelease();
  console.log(f);
})();

// Simple test script for the platform detection
