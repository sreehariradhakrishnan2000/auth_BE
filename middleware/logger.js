const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'api.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const formatLog = (message) => `${new Date().toISOString()} ${message}\n`;

const logToFile = (message) => {
  fs.appendFileSync(logFile, formatLog(message), 'utf8');
};

const apiLogger = (req, res, next) => {
  const start = Date.now();
  const requestBody = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '{}';
  const queryString = req.query && Object.keys(req.query).length ? JSON.stringify(req.query) : '{}';

  const requestMessage = `REQUEST ${req.method} ${req.originalUrl} query=${queryString} body=${requestBody}`;
  console.log(requestMessage);
  logToFile(requestMessage);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseMessage = `RESPONSE ${req.method} ${req.originalUrl} status=${res.statusCode} duration=${duration}ms`;
    console.log(responseMessage);
    logToFile(responseMessage);
  });

  next();
};

module.exports = apiLogger;
