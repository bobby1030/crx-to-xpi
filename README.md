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
* Give some warnings when the addon use an WebExtension API that is not supported by Firefox.

## How does it work?
This project helps you declare gecko support in `manifest.json`, and then zip up the source code into `.xpi` format.