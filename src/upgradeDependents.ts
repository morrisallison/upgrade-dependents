import findWorkspaceRoot = require("find-yarn-workspace-root");

import { createLogger, Logger } from "./createLogger";
import { getDependentPackages } from "./getDependentPackages";
import { getPackageInfo } from "./getPackageInfo";
import * as logs from "./logs";
import { upgradePackages } from "./upgradePackages";

interface Options {
  dryRun?: boolean;
  logger?: Logger;
  workspaceDir?: string;
}

export async function upgradeDependents(packageDir: string, options: Options = {}) {
  const { dryRun = false, logger = createLogger() } = options;
  const { meta: workingPackageMeta, location } = await getPackageInfo(packageDir);
  const workspaceDir = options.workspaceDir || findWorkspaceRoot(location);

  if (!workspaceDir) {
    throw new Error("The root workspace directory couldn't be found.");
  }

  logger.log(logs.foundPackage(workingPackageMeta));

  const packageInfos = await getDependentPackages({ workspaceDir, workingPackageMeta, logger });
  const packageCount = packageInfos.length;

  if (packageCount === 0) {
    logger.log(logs.dependentsMissing());
    return;
  }

  logger.log(logs.dependentsFound(packageCount));

  await upgradePackages({
    dryRun,
    logger,
    packageInfos,
    workingPackageMeta
  });
}
