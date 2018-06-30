declare module "json-file-plus" {
  type File = {
    set(diff: any): any;
    save(): Promise<any>;
  };

  function readJSON(path: string): File;

  export = readJSON;
}
