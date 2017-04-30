# crx-to-xpi
> A simple tool that can help you port WebExtensions to Firefox easily.  

[![npm version](https://badge.fury.io/js/crx-to-xpi.svg)](https://www.npmjs.com/package/crx-to-xpi)

## Dependencies
* `node`
* `npm` (or `yarn`, whatever)

## Usage
```shell
npm install -g crx-to-xpi
crx-to-xpi your-addon.crx
```

## TODO
* Implement a better path processing method to support non-Unix-like environment.
* Give some warnings when the extension uses an WebExtension API that hasn't been supported by Firefox.
* Allowing the source code of the extension to be used as input.

## How does it work?
This project helps you declare gecko support in `manifest.json`, and then zip up the source code into `.xpi` format.  
Reference: [https://hacks.mozilla.org/2015/10/porting-chrome-extensions-to-firefox-with-webextensions/](https://hacks.mozilla.org/2015/10/porting-chrome-extensions-to-firefox-with-webextensions/)
