# crx-to-xpi
> A simple tool that can help you port WebExtensions to Firefox easily.

## Dependencies
* `node`
* `npm` (or `yarn`, whatever)

## Usage
```shell
npm install
./crx-to-xpi your-addon.crx
```

## TODO
* Implement a better path processing method to support non-Unix-like environment.
* Give some warnings when the extension use an WebExtension API that is not supported by Firefox.
* Allow source code of extension to be used as input.

## How does it work?
This project helps you declare gecko support in `manifest.json`, and then zip up the source code into `.xpi` format.  
Reference: [https://hacks.mozilla.org/2015/10/porting-chrome-extensions-to-firefox-with-webextensions/](https://hacks.mozilla.org/2015/10/porting-chrome-extensions-to-firefox-with-webextensions/)