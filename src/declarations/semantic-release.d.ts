declare namespace SemanticRelease {
  export interface Logger {
    log(...args: any[]): void;
    error(...args: any[]): void;
  }

  export interface PluginConfig {
    dryRun?: boolean;
  }

  export interface Context {
    logger: Logger;
  }
}
