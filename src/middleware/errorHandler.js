const logger = require("../config/logger");

function notFound(req, res) {
  // eslint-disable-line
  logger.warn("Not Found", {
    route: req.originalUrl,
    method: req.method,
  });
  res.status(404).json({ error: "Not Found" });
}

function errorHandler(err, req, res, next) {
  // eslint-disable-line
  logger.error("Internal Server Error", {
    error: err.message,
    stack: err.stack,
  });
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
}

module.exports = {
  notFound,
  errorHandler,
};
