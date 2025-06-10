const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/activity.log');

function logAction(username, action) {

    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] User: ${username} | Action: ${action}\n`;

    console.log(entry);
    fs.appendFile(logFile, entry, (err) => {
        if (err) console.error('Logging error: ', err);
    });
}

module.exports = logAction;