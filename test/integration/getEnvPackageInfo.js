require("ts-node/register");
const path = require("path");

const { getPackageInfo } = require("../../src/getPackageInfo");

const ENV_PATH = path.resolve(__dirname, "../env");
exports.ENV_PATH = ENV_PATH;

/**
 * @param {string} packageDirname
 * @returns {PackageInfo}
 */
exports.getEnvPackageInfo = getEnvPackageInfo;
async function getEnvPackageInfo(packageDirname) {
  const packageDir = path.join(ENV_PATH, "packages", packageDirname);

  return getPackageInfo(packageDir);
}
