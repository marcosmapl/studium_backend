const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

function notFound(req, res) {

    logger.warn("Not Found", {
        route: req.originalUrl,
        method: req.method,
    });

    res.status(HttpStatus.NOT_FOUND).json({ error: "Not Found" });
}

function errorHandler(err, req, res, next) {

    logger.error("Internal Server Error", {
        error: err.message,
        stack: err.stack,
    });

    res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error", details: err.message });
}

module.exports = {
    notFound,
    errorHandler,
};
