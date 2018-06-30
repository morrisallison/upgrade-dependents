import {
  availableDesignations,
  packagePropertyByDesignation
} from "./designations";

export function getDependencyDesignation(
  dependencyName: string,
  packageMeta: GetMonorepoPackages.PackageMeta
) {
  return availableDesignations.find(designation => {
    const property = packagePropertyByDesignation[designation];
    const dependencies = packageMeta[property] as GetMonorepoPackages.DependenciesHashTable;

    if (!dependencies) {
      return false;
    }

    return Boolean(dependencies[dependencyName]);
  });
}
