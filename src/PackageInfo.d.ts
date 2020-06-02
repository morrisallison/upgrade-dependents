import { PackageMeta } from "get-monorepo-packages";

export type PackageInfo = {
  location: string;
  meta: PackageMeta;
};
