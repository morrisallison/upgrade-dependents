import * as semverUtils from 'semver-utils';

export function createRange(oldRange: string, newVersion: string) {
  const parsedRange = semverUtils.parseRange(oldRange);
  const parsedVersion = semverUtils.parse(newVersion);

  return `${parsedRange[0].operator}${parsedVersion.toString()}`;
}
