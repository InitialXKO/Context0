const fs = require("fs");
const os = require("os");
const path = require("path");

function createIsolatedEnvironment() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "context0-test-"));
  return {
    tempRoot,
    cleanup: () => {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    },
  };
}

module.exports = {
  createIsolatedEnvironment,
};
