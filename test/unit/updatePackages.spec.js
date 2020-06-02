require("ts-node/register");
const expect = require("expect");
const { describe, it, beforeEach, afterEach, context } = require("tap").mocha;
const td = require("testdouble");

const { logger } = require("../mocks/createLogger");
const jsonFilePlusMock = require("../mocks/json-file-plus");
td.replace("json-file-plus", jsonFilePlusMock.exports);

const { upgradePackages } = require("../../src/upgradePackages");
const logs = require("../../src/logs");

describe("upgradePackages", () => {
  let dependencyName;
  let dependentMetas;
  let newDesignations;
  let newRanges;
  let options;

  beforeEach(() => {
    dependencyName = "foo";

    dependentMetas = [
      {
        name: "bar",
        version: "0.1.0",
        dependencies: {
          foo: ">=0.0.323"
        }
      },
      {
        name: "baz",
        version: "1.1.4",
        devDependencies: {
          foo: "^0.1.3"
        }
      },
      {
        private: true,
        name: "boom",
        version: "12345.1.4",
        peerDependencies: {
          foo: "0.1.677-beta"
        }
      },
      {
        name: "pow",
        version: "1.1.4",
        dependencies: {
          foo: "~0.1.0-beta"
        }
      }
    ];

    newRanges = [">=0.2.0", "^0.2.0", "0.2.0", "~0.2.0"];

    newDesignations = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "dependencies"
    ];

    const mockDataCount =
      dependentMetas.length + newRanges.length + newDesignations.length;
    const hasCompleteMockData = mockDataCount % 3 === 0;

    if (!hasCompleteMockData) {
      throw new Error("Missing mock data.");
    }

    options = {
      logger,
      dryRun: true,
      packageInfos: dependentMetas.map(dependentMeta => ({
        location: `/path/to${dependentMeta.name}`,
        meta: dependentMeta
      })),

      workingPackageMeta: {
        name: dependencyName,
        version: "0.2.0"
      }
    };

    for (const dependentMeta of dependentMetas) {
      td.when(
        jsonFilePlusMock.exports(`/path/to${dependentMeta.name}/package.json`)
      ).thenResolve(jsonFilePlusMock.file);
    }
  });

  afterEach(td.reset);

  it("upgrades the dependency version range in each given package", async () => {
    await upgradePackages(options);

    newRanges.forEach((newRange, i) => {
      td.verify(
        jsonFilePlusMock.file.set({
          [newDesignations[i]]: {
            foo: newRange
          }
        })
      );
    });
  });

  it("logs upgrades", async () => {
    await upgradePackages(options);

    dependentMetas.forEach((dependentMeta, i) => {
      td.verify(
        options.logger.log(
          logs.packageUpgraded(dependentMeta, dependencyName, newRanges[i])
        )
      );
    });
  });

  it("doesn't write to the filesystem", async () => {
    await upgradePackages(options);

    td.verify(jsonFilePlusMock.file.save(), {
      times: 0,
      ignoreExtraArgs: true
    });
  });

  it("logs the dry run status", async () => {
    await upgradePackages(options);

    td.verify(options.logger.log(logs.upgradeDryRun()));
  });

  context("when dry run is disabled", () => {
    beforeEach(() => {
      options.dryRun = false;
    });

    it("writes to the filesystem", async () => {
      await upgradePackages(options);

      td.verify(jsonFilePlusMock.save());
    });
  });
});
