import { PackageMeta, DependenciesHashTable } from "get-monorepo-packages";

import {
  availableDesignations,
  packagePropertyByDesignation
} from "./designations";

export function getDependencyDesignation(
  dependencyName: string,
  packageMeta: PackageMeta
) {
  return availableDesignations.find(designation => {
    const property = packagePropertyByDesignation[designation];
    const dependencies = packageMeta[property] as DependenciesHashTable;

    if (!dependencies) {
      return false;
    }

    return Boolean(dependencies[dependencyName]);
  });
}
