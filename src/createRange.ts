import * as semverUtils from "semver-utils";

export function createRange(oldRange: string, newVersion: string) {
  const parsedRange = semverUtils.parseRange(oldRange);
  const operator = parsedRange[0].operator || "";
  const parsedVersion = semverUtils.parse(newVersion);

  return `${operator}${parsedVersion.toString()}`;
}
