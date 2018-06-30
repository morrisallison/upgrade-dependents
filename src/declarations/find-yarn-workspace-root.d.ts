declare module "find-yarn-workspace-root" {
  function findRoot(path: string): string;

  export = findRoot;
}
