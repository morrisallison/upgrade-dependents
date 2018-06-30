declare namespace GetMonorepoPackages {
  export type DependenciesHashTable = {
    [key: string]: string;
  };

  export type PackageMeta = {
    name: string;
    version: string;
    dependencies?: DependenciesHashTable;
    devDependencies?: DependenciesHashTable;
    peerDependencies?: DependenciesHashTable;
    [key: string]: string | DependenciesHashTable | undefined;
  };

  export type PackageInfo = {
    location: string;
    package: PackageMeta;
  };
}

declare module "get-monorepo-packages" {
  function getPackages(rootDir: string): GetMonorepoPackages.PackageInfo[];

  export = getPackages;
}
