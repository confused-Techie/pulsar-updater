const findInstallChannel = require("../src/find-install-channel.js");
const shell = require("shelljs");

describe("pulsar-updater findInstallChannel", () => {
  describe("windows choco install", () => {
    it("fails if 'choco' isn't found", () => {
      spyOn(shell, "which").andReturn(false);

      let installCheck = findInstallChannel.windows_chocoInstalled();
      expect(installCheck).toBe(false);
    });
    it("fails if pulsar isn't included in stdout", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 0, stdout: "not -pu-l-sar" });

      let installCheck = findInstallChannel.windows_chocoInstalled();
      expect(installCheck).toBe(false);
    });
    it("fails if exit code is not 0", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 1, stdout: "" });

      let installCheck = findInstallChannel.windows_chocoInstalled();
      expect(installCheck).toBe(false);
    });
    it("succeeds if pulsar is included in stdout", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 0, stdout: "pulsar" });

      let installCheck = findInstallChannel.windows_chocoInstalled();
      expect(installCheck).toBe(true);
    });
  });

  describe("windows winget install", () => {
    it("fails if winget isn't found", () => {
      spyOn(shell, "which").andReturn(false);

      let installCheck = findInstallChannel.windows_wingetInstalled();
      expect(installCheck).toBe(false);
    });
    it("fails if pulsar isn't found in stdout", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 0, stdout: "not -pu-l-sar" });

      let installCheck = findInstallChannel.windows_wingetInstalled();
      expect(installCheck).toBe(false);
    });
    it("fails if exit code is not 0", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 1, stdout: "" });

      let installCheck = findInstallChannel.windows_wingetInstalled();
      expect(installCheck).toBe(false);
    });
    it("succeeds if pulsar is included in stdout", () => {
      spyOn(shell, "which").andReturn(true);
      spyOn(shell, "exec").andReturn({ code: 0, stdout: "Pulsar" });

      let installCheck = findInstallChannel.windows_wingetInstalled();
      expect(installCheck).toBe(true);
    });
  });
});
