import * as path from "path";
import * as readPkg from "read-pkg";

import { PackageInfo } from "./PackageInfo";

export async function getPackageInfo(packageDir: string): Promise<PackageInfo> {
  const location = path.resolve(packageDir);
  const meta = await readPkg({ cwd: packageDir });

  return { location, meta };
}
