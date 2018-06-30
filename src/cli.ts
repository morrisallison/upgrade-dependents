import * as yargs from "yargs";

import { createLogger } from "./createLogger";
import { upgradeDependents } from "./upgradeDependents";

function handleError(error: Error) {
  // tslint:disable-next-line:no-console
  console.error(error);
  process.exit(1);
}

function handleRunCommand(argv: yargs.Arguments) {
  const { workspaceDir, packageDir, dryRun } = argv;
  const logger = createLogger();
  const options = { dryRun, logger, workspaceDir };

  upgradeDependents(packageDir, options).catch(handleError);
}

function createRunCommand() {
  /* tslint:disable:object-literal-sort-keys */
  return {
    describe: "Upgrades all compatible dependent packages in the workspace.",
    command: "$0",
    handler: handleRunCommand,
    builder: {
      packageDir: {
        alias: 'p',
        describe: "The directory of the package to propagate.",
        normalize: true,
        default: process.cwd(),
        defaultDescription: "The current working directory."
      },
      workspaceDir: {
        alias: 'w',
        describe: "The directory to search for dependents.",
        normalize: true,
        defaultDescription: "Yarn workspace directory relative to the package directory."
      },
      dryRun: {
        alias: 'd',
        describe: "Run without persisting changes.",
        boolean: true
      },
    }
  };
  /* tslint:enable:object-literal-sort-keys */
}

export function cli() {
  // tslint:disable-next-line:no-unused-expression
  yargs.command(createRunCommand()).help().argv;
}
