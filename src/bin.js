#!/usr/bin/env node

const startTime = process.hrtime();

const drfg = require('./lib');
const {blankLine, colors, fixTime, question, starBox} = require('./utilities');
const currentLibVersion = 'v' + require('../package.json').version;

const repo = process.argv[2] || '';
let destinationFolder = process.argv[3] || '';
let version = process.argv[4];
const skipInstall = (process.argv[5] === 'no-npm' || destinationFolder === 'no-npm' || version === 'no-npm');

if (!destinationFolder || !destinationFolder.length || destinationFolder === 'no-npm') {
    destinationFolder = repo.includes('/') ? repo.split('/')[1] : '';
}

if (version === 'no-npm') {
    version = null;
}

/**
 * Validate Inputs
 */
if (!repo || repo === '' || repo === 'fail' || !repo.includes('/') || !destinationFolder || destinationFolder === '' || destinationFolder === 'fail') {
    blankLine();
    starBox(
        colors.red + 'Usage: npx drfg <github-repo> <new-folder?>' + colors.reset
        + '\n\n' + colors.bold + '<github-repo>' + colors.reset + ' should be in the format ' + colors.bold + '"username/my-awesome-repo"' + colors.reset + '.'
        + '\n' + colors.bold + '<new-folder>' + colors.reset + ' is the optional folder name to extract the repo into (defaults to repo name).'
    );
    blankLine();
    process.exit(1);
}

/**
 * Are we globally installed?
 */
if (!process.env.npm_execpath) {
    // We seem to be running from a globally installed instance... Let's check for updates.
    blankLine();
    starBox('It appears this module (drfg) was installed globally.', false, true);
    blankLine();
    console.log('Checking for updates...');

    drfg.getVersionInfo('neonexus/drfg').then((currentInfo) => {
        if (currentInfo.version !== currentLibVersion) {
            blankLine();
            starBox(
                '  It seems there\'s an update.\nTo update your local instance:'
                + '\n\n         ' + colors.blue + 'npm i -g drfg' + colors.reset
                + '\n\nInstalled Version: ' + colors.invert + ' ' + currentLibVersion + ' ' + colors.reset
                + '\n   Latest Version: ' + colors.bold + colors.invert + ' ' + currentInfo.version + ' ' + colors.reset
                , true // alignLeft
                , false // isSmall
                , 10 // padding
            );

            question('Would you like to continue? (Y/n)', (answer) => {
                if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
                    console.log('Stopping...');
                } else {
                    getOnWithIt();
                }
            });
        } else {
            console.log('We\'re up-to-date. Moving on...');
            getOnWithIt();
        }
    }).catch((e) => {
        blankLine();
        console.error('There was an error checking with the GitHub API...');
        console.error(e);
        blankLine();
    });
} else {
    getOnWithIt();
}

function getOnWithIt() {
    drfg.downloadAndExtract(repo, destinationFolder, version, skipInstall).then((downloadInfo) => {
        const timeElapsed = process.hrtime(startTime);

        blankLine();
        starBox(
            '        Repository: ' + colors.bold + repo + colors.reset
            + '\n           Version: ' + colors.bold + downloadInfo.version + colors.reset
            + '\n      Extracted to: ' + colors.bold + destinationFolder + colors.reset
            + '\n\n     Download Time: ' + colors.bold + downloadInfo.downloadTime + colors.reset
            + '\n   Extraction Time: ' + colors.bold + downloadInfo.extractionTime + colors.reset
            + '\n Installation Time: ' + colors.bold + downloadInfo.installationTime + colors.reset
            + '\nTotal Library Time: ' + colors.bold + downloadInfo.totalTime + colors.reset
            + '\nTotal Elapsed Time: ' + colors.invert + ' ' + fixTime(timeElapsed) + ' ' + colors.reset
            + '\n\n  Size of Download: ' + colors.bold + downloadInfo.zipballSize + colors.reset
            + '\n Uncompressed Size: ' + colors.bold + downloadInfo.extractedSize + colors.reset
            + '\n Post-Install Size: ' + colors.invert + ' ' + downloadInfo.installedSize + ' ' + colors.reset
            , true // alignLeft
            , true // isSmall
        );
        blankLine();

        process.exit(0); // force a clean exit
    }).catch((e) => {
        console.error(e);
    });
}
