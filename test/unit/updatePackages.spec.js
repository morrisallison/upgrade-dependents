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
      }
    ];
    newRanges = [
      ">=0.2.0",
      "^0.2.0"
    ];
    options = {
      logger,
      dryRun: true,
      packageInfos: [
        {
          location: "/random/path",
          meta: dependentMetas[0]
        },
        {
          location: "/whoa/buddy",
          meta: dependentMetas[1]
        }
      ],
      workingPackageMeta: {
        name: dependencyName,
        version: "0.2.0"
      }
    };

    td.when(jsonFilePlusMock.exports("/random/path/package.json"))
      .thenResolve(jsonFilePlusMock.file);
    td.when(jsonFilePlusMock.exports("/whoa/buddy/package.json"))
      .thenResolve(jsonFilePlusMock.file);
  });

  afterEach(td.reset);

  it("upgrades the dependency version range in each given package", async () => {
    await upgradePackages(options);

    td.verify(
      jsonFilePlusMock.file.set({
        dependencies: {
          foo: newRanges[0]
        }
      })
    );
    td.verify(
      jsonFilePlusMock.file.set({
        devDependencies: {
          foo: newRanges[1]
        }
      })
    );
  });

  it("logs upgrades", async () => {
    await upgradePackages(options);

    td.verify(
      options.logger.log(logs.packageUpgraded(dependentMetas[0], dependencyName, newRanges[0]))
    );
    td.verify(
      options.logger.log(logs.packageUpgraded(dependentMetas[1], dependencyName, newRanges[1]))
    );
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

    td.verify(
      options.logger.log(logs.upgradeDryRun())
    );
  });

  context("when dry run is disabled", () => {
    beforeEach(() => {
      options.dryRun = false;

      td.when(jsonFilePlusMock.save()).thenResolve();
    });

    it("writes to the filesystem", async () => {
      await upgradePackages(options);
    });
  });
});
