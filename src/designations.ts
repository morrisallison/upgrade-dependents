export const designations = {
  DEV: "DEV",
  PEER: "PEER",
  RUNTIME: "RUNTIME"
};

export const availableDesignations = Object.values(designations);

export const packagePropertyByDesignation = {
  [designations.DEV]: "devDependencies",
  [designations.PEER]: "peerDependencies",
  [designations.RUNTIME]: "dependencies"
};
