import { packagePropertyByDesignation } from "./designations";
import { getDependencyDesignation } from "./getDependencyDesignation";

export function getDesignationProperty(
  dependencyName: string,
  packageMeta: GetMonorepoPackages.PackageMeta
) {
  const designation = getDependencyDesignation(dependencyName, packageMeta);

  if (!designation) {
    return undefined;
  }

  return packagePropertyByDesignation[designation];
}
