import * as semver from "semver";
import * as semverUtils from "semver-utils";

import { Logger } from "./createLogger";
import { createRange } from "./createRange";
import { packagePropertyByDesignation } from "./designations";
import { getDependencyDesignation } from "./getDependencyDesignation";
import * as logs from "./logs";
import { PackageInfo } from "./PackageInfo";

function isComplexRange(range: string) {
  const parsedRange = semverUtils.parseRange(range);

  return parsedRange.length > 1;
}

interface Options {
  workingPackageMeta: GetMonorepoPackages.PackageMeta;
  logger: Logger;
}

export function createDependentPackageDeterminer({ workingPackageMeta, logger }: Options) {
  const { name: dependencyName, version: dependencyVersion } = workingPackageMeta;

  return function isDependentPackage(info: PackageInfo) {
    const { meta: dependentMeta } = info;
    const designation = getDependencyDesignation(dependencyName, dependentMeta);

    if (!designation) {
      return false;
    }

    const property = packagePropertyByDesignation[designation];
    const dependencies = dependentMeta[property] as GetMonorepoPackages.DependenciesHashTable;
    const dependentRange = dependencies[dependencyName];

    if (isComplexRange(dependentRange)) {
      logger.warn(logs.skipPackageWithComplexRange(dependentMeta));
      return false;
    }

    const upgradedRange = createRange(dependentRange, dependencyVersion);

    if (dependentRange === upgradedRange) {
      return false;
    }

    return semver.satisfies(dependencyVersion, dependentRange);
  };
}
