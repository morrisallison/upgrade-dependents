import { upgradeDependents } from "./upgradeDependents";

interface PluginConfig extends SemanticRelease.PluginConfig {
  packageDir?: string;
  workspaceDir?: string;
}

function createLogger(logger: SemanticRelease.Logger) {
  return {
    error: (...args: any[]) => logger.error(...args),
    log: (...args: any[]) => logger.log(...args),
    warn: (...args: any[]) => logger.log(...args)
  };
}

export async function semanticReleasePrepare(pluginConfig: PluginConfig, context: SemanticRelease.Context) {
  const {
    dryRun = false,
    packageDir = process.cwd(),
    workspaceDir
  } = pluginConfig;
  const logger = createLogger(context.logger);
  const options = { dryRun, logger, workspaceDir };

  await upgradeDependents(packageDir, options);
}
