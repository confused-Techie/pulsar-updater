const t = require("./src/find-install-method.js");

(async () => {
  let f = await t();
  console.log(f);
})();

// Simple test script for the platform detection
