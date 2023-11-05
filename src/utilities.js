const fs = require('fs');
const path = require('path');

const utils = {
    colors: {
        blue: '\x1b[34m',
        bold: '\x1b[1m',
        invert: '\x1b[7m',
        red: '\x1b[31m',
        reset: '\x1b[0m'
    },

    blankLine: () => {
        console.log('');
    },

    fixTime: (timeElapsed) => {
        const executionTimeInMilliseconds = timeElapsed[0] * 1000 + timeElapsed[1] / 1e6;

        let timeOut;

        // Determine whether to display in milliseconds, seconds, or minutes
        if (executionTimeInMilliseconds < 1000) {
            timeOut = executionTimeInMilliseconds.toFixed(2) + ' ms';
        } else if (executionTimeInMilliseconds < 60000) {
            const executionTimeInSeconds = executionTimeInMilliseconds / 1000;
            timeOut = executionTimeInSeconds.toFixed(2) + ' s';
        } else {
            const executionTimeInMinutes = executionTimeInMilliseconds / 60000;
            timeOut = executionTimeInMinutes.toFixed(2) + ' m';
        }

        return timeOut;
    },

    // Convert bytes to human-readable
    formatBytes: (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const finalNumber = bytes / Math.pow(1024, i);

        return ((i > 0) ? finalNumber.toFixed(2) : finalNumber) + ' ' + sizes[i];
    },

    getDirectorySize: (directory) => {
        let size = 0;
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                size += utils.getDirectorySize(filePath);
            } else {
                size += stats.size;
            }
        }

        return size;
    },

    question: (q, a, readline = require('readline')) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(q + ': ', (answer) => {
            rl.close();
            a(answer);
        });
    },

    starBox: (text, alignLeft = false, isSmall = false, padding = 2) => {
        // Remove color codes from the text for formatting purposes
        const cleanLines = text.replace(/\x1b\[[0-9;]*m/g, '').split('\n');
        const lines = text.split('\n');
        const maxLength = cleanLines.reduce((max, line) => Math.max(max, line.length), 0);
        const fullLine = '*'.repeat(maxLength + (padding * 2) + 2);
        const emptyLine = `*${' '.repeat(maxLength + (padding * 2))}*`;

        const box = [fullLine];

        if (!isSmall) {
            box.push(emptyLine);
        }

        lines.forEach((line, index) => {
            let paddedText = '*';

            if (alignLeft) {
                const rightPadding = maxLength - cleanLines[index].length + padding;
                paddedText += ' '.repeat(padding) + line + ' '.repeat(rightPadding) + '*';
            } else {
                const totalSpaces = maxLength - cleanLines[index].length;

                if (totalSpaces % 2 === 0) {
                    const spaces = (totalSpaces / 2) + padding;
                    paddedText += ' '.repeat(spaces) + line + ' '.repeat(spaces);
                } else {
                    const leftSpaces = Math.floor(totalSpaces / 2);
                    const rightSpaces = Math.ceil(totalSpaces / 2);
                    paddedText += ' '.repeat(leftSpaces + padding) + line + ' '.repeat(rightSpaces + padding);
                }

                paddedText += '*';
            }

            box.push(paddedText);
        });

        if (!isSmall) {
            box.push(emptyLine);
        }

        box.push(fullLine);

        console.log(box.join('\n'));
    }
};

module.exports = utils;
