const td = require("testdouble");

const logger = { log: td.func(), warn: td.func() };
const createLogger = td.func(() => logger);

module.exports = {
  exports: createLogger,
  logger
};
