declare module "semver-utils" {
  export type ParsedVersion = {
    toString: () => string;
  };

  type ParsedRangeElement = {
    operator: string;
  };

  export type ParsedRange = ParsedRangeElement[];

  export function parse(version: string): ParsedVersion;
  export function parseRange(range: string): ParsedRange;
}
