# drfg - Download Release From GitHub

[![npm](https://img.shields.io/npm/dm/drfg?logo=npm&style=plastic)](https://www.npmjs.com/package/drfg)
[![Build Status](https://img.shields.io/travis/com/neonexus/drfg/release?style=plastic&logo=travis)](https://app.travis-ci.com/neonexus/drfg)
[![NPM version](https://img.shields.io/npm/v/drfg/latest?style=plastic&logo=npm&color=blue)](https://www.npmjs.com/package/drfg)
[![GitHub version](https://img.shields.io/github/v/release/neonexus/drfg?style=plastic&logo=github&label=GitHub@latest)](https://github.com/neonexus/drfg)
[<img src="gpl.svg" width="119" height="18">](LICENSE)

The idea of this package, is to make downloading / extracting / installing a GitHub repo's latest release a breeze (without creating a new repo, or using Git for that matter). Both in the terminal, and programmatically, if you are into that kind of thing...

`npx drfg <github-username/repo>`

## This works for ALMOST any GitHub repo...

As long as the repository is using [GitHub's releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) feature, this script will work.

If a call to `https://api.github.com/repos/{username/repo}/releases/latest` returns a `tag_name` and `zipball_url`, then the script will download the zipball from `zipball_url`.

Additionally, if the repo contains a `package.json` after extraction, `npm install` will be run automatically, unless disabled. See [advanced usage](#a-little-more-advanced) for more.

## Table of Contents

* [Terminal Usage](#terminal-usage)
  * [Simple Usage](#simple-usage)
  * [A Little More Advanced](#a-little-more-advanced)
* [Installing `drfg` Globally](#installing-drfg-globally)
  * [Additional Script Names](#additional-script-names)
* [Programmatic Usage](#programmatic-usage)
  * [Advanced Usage](#advanced-usage)
  * [Getting Version Info for a Repo](#getting-version-info-for-a-repo)
  * [Don't Forget to Handle Errors...](#dont-forget-to-handle-errors)

## Terminal Usage

### Simple Usage

`npx drfg <github-repo>`

OR

`npx drfg <github-repo> <new-folder-name>`

For example, if you wanted to "clone" (download/extract/install) the repo [sails-react-bootstrap-webpack](https://github.com/neonexus/sails-react-bootstrap-webpack), just do something like:

```shell
npx drfg neonexus/sails-react-bootstrap-webpack
```

This will download / extract / `npm install` the repo into a new folder `sails-react-bootstrap-webpack`. To change where the files get extracted to, add a second parameter to the command:

```shell
npx drfg neonexus/sails-react-bootstrap-webpack my-new-site
````

This will extract into `my-new-site`, instead of the repo name.

### A Little More Advanced

If the repo contains a `package.json` in the root, but you don't want to `npm install` after extraction, just add `no-npm`:

`npx drfg <github-repo> <no-npm?>`

**OR**

`npx drfg <github-repo> <new-folder> <no-npm?>`

You can also provide a specific version to download / extract:

`npx drfg <github-repo> <new-folder> <version?> <no-npm?>`

**NOTE:** When supplying a version, you **MUST** supply a folder name.

This will download `v4.2.3`, into the folder `new-site`, and will skip the `npm install` step:
```shell
npx drfg neonexus/sails-react-bootstrap-webpack new-site v4.2.3 no-npm
```

## Installing `drfg` Globally

```shell
npm i -g drfg
```

You can install `drfg` globally and run it directly (if you have your `$PATH` set correctly). This will save a small amount of time, as `npx` won't have to download and install, before running `drfg`.
However, this also means you won't always be using the most up-to-date version of `drfg` (GitHub may change their API, security issues may arise, etc.).

To help ensure you are always up-to-date, `drfg` will use itself to check if there is an update, and if your current version doesn't match the latest version on GitHub, it will let you know.
This does **not** prevent you from using the version you already have installed, but it will ask you if you want to continue (you can simply hit enter).

![Example Update](example-update.png)

### Additional Script Names

Once installed globally, you can use `drfg` directly, with one of its few different binary names:

* `drfg`
* `dl-rl-from-gh`
* `download-rl-from-gh`
* `download-rl-from-github`
* `download-release-from-gh`
* `download-release-from-github`

## Programmatic Usage

Using `.then()`:

```javascript
const drfg = require('drfg');

drfg.downloadAndExtract('username/my-repo', 'new-folder').then(
    (downloadInfo) => {}
);

// OR

drfg.downloadAndExtract({
    repo: 'username/my-repo',
    destinationFolder: 'my-clone'
}).then((downloadInfo) => {});
```

Using `await`:
```javascript
const drfg = require('drfg');

const downloadInfo = await drfg.downloadAndExtract(
    'username/my-repo',
    'new-folder'
);

// OR

const downloadInfo = await drfg.downloadAndExtract({
    repo: 'username/my-repo',
    destinationFolder: 'my-clone'
});
```

`downloadInfo` will look something like:

```json5
{
    version: 'v1.0.1',
    downloadTime: '714.82 ms',
    extractionTime: '55.17 ms',
    installationTime: '2.75 s',
    totalTime: '3.61 s',
    zipballSize: '45.11 KiB',
    extractedSize: '146.73 KiB',
    installedSize: '19.45 MiB'
}
```

### Advanced usage

```javascript
const drfg = require('drfg');

// Parameters are: destination-folder, repo, version, skipNpmInstall
const downloadInfo = await drfg.downloadAndExtract(
    'username/my-repo',
    'new-folder',
    'v1.0.1',
    true
);

// OR
const downloadInfo = await drfg.downloadAndExtract({
    repo: 'username/my-repo',
    version: 'v1.0.1',
    skipInstall: true,
    destinationFolder: 'my-clone'
});
```

### Getting Version Info for a Repo

```javascript
const drfg = require('drfg');

const latestVersionInfo = await drfg.getVersionInfo('username/my-repo');

// OR

drfg.getVersionInfo('username/my-repo').then((latestVersionInfo) => {
    // Do stuff with the info...
});
```

`latestVersionInfo` will look something like:

```json5
{
    name: 'v1.0.1 (2023-10-01)',
    description: 'The version description body. This will likely contain markdown.',
    version: 'v1.0.1',
    isDraft: false,
    isPrerelease: false,
    createdAt: '2023-10-01T04:19:00Z',
    publishedAt: '2023-10-01T04:19:00Z',

    // `userSite` is the HTML URL for human use:
    userSite: 'https://github.com/{username/repo}/releases/tag/v1.0.1',

    // `zipball` is the URL drfg will use internally to download the repo:
    zipball: 'https://api.github.com/repos/{username/repo}/zipball/v1.0.1'
}
```

Get info for a specific version:

```javascript
const drfg = require('drfg');

const latestVersionInfo = await drfg.getVersionInfo(
    'username/my-repo',
    'v1.0.1'
);
```

### Don't Forget to Handle Errors...

```javascript
const drfg = require('drfg');

drfg.downloadAndExtract('username/my-repo', 'new-folder')
    .then((successMessage) => {})
    .catch((e) => {});

drfg.getVersionInfo('username/my-repo')
    .then((latestVersionInfo) => {})
    .catch((e) => {});

// OR

try {
    const downloadInfo = await drfg.downloadAndExtract(
        'username/my-repo',
        'new-folder'
    );
} catch (e) {
    // Display the error...
}

try {
    const latestVersionInfo = await drfg.getVersionInfo(
        'username/my-repo'
    );
} catch (e) {
    // Display the error...
}
```
