const winston = require("winston");

let logger = null;
exports.getLogger = () => {
  if (logger === null) {
    logger = winston.createLogger({
      // Log only if level is less than (meaning more severe) or equal to this
      level: "info",
      // Use timestamp and printf to create a standard log format
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      // Log to the console and a file
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/server.log" }),
      ],
    });
  }
  return logger;
};

exports.encapsulateRequest = (req, fn) => {
  try {
    return fn(req);
  } catch (err) {
    logger.log("error", err);
    throw err;
  }
};
