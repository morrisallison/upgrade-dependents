const td = require("testdouble");

const set = td.func();
const save = td.func();
const file = { set, save };
const jsonFilePlus = td.func();

module.exports = {
  exports: jsonFilePlus,
  set,
  save,
  file
};
