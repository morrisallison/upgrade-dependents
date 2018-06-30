require("ts-node/register");
const expect = require("expect");
const { describe, it, before } = require("tap").mocha;

const { logger } = require("../mocks/createLogger");
const { ENV_PATH, getEnvPackageInfo } = require("./getEnvPackageInfo");

const { getDependentPackages } = require("../../src/getDependentPackages");

describe("getDependentPackages", () => {
  const workspaceDir = ENV_PATH;

  let workingPackageMeta;

  before(async () => {
    workingPackageMeta = (await getEnvPackageInfo("a")).meta;
  });

  it("retrieves a list of packages", async () => {
    const packages = await getDependentPackages({ workspaceDir, workingPackageMeta, logger });

    expect(packages).toEqual(expect.any(Array));
  });

  it("retrieves only dependent packages", async () => {
    const packages = await getDependentPackages({ workspaceDir, workingPackageMeta, logger });

    expect(packages).toHaveProperty("length", 2);
    expect(packages).toHaveProperty([0, "meta", "name"], "@morrisallison/b");
    expect(packages).toHaveProperty([1, "meta", "name"], "@morrisallison/d");
  });
});
