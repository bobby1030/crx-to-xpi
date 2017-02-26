#! /usr/bin/env node

const fs = require('fs');
const crx = require('unzip-crx');
const archiver = require('archiver');
const path = require('path');

var crxFilePath = process.argv[2];
var crxUnpackPath = process.argv[3] || path.basename(crxFilePath, '.crx') + '_unzipped';

var log = function(type = 'status', content) {
    if (type == 'error') {
        console.error(`Error: ${content}`)
    } else {
        console.log(`Status: ${content}`)
    }
}

var pushObject = function(obj, key, value) {
    obj[key] = value;
    return obj;
}

var readCrxFile = function() {
    if (path.extname(crxFilePath) == '.crx') {
        crx(crxFilePath, crxUnpackPath)
            .then(() => {
                log('status', 'Unpacking CRX file.')
                modifyManifest()
            })
    } else {
        log('error', `\"${crxFilePath}\" is not a valid Chrome extension`);
    }
}

var modifyManifest = function() {
    fs.readFile(`${crxUnpackPath}/manifest.json`, 'utf8', (err, data) => {
        var manifestContent = JSON.parse(data);
        
        var declareGeckoSupport = {
            'gecko': {
                'id': `${manifestContent.name}@crx-to-xpi`
            }
        };
        // Infos that need to be pushed into "manifest.json"
        
        manifestContent = pushObject(manifestContent, 'applications', declareGeckoSupport);
        fs.writeFile(`${crxUnpackPath}/manifest.json`, JSON.stringify(manifestContent), 'utf8', (err) => {
            packXPI(manifestContent.name)
        });
        // Write modified manifest
    })
}

var packXPI = function(name) {
    var output = fs.createWriteStream(__dirname + `/${name}.xpi`);
    var xpi = archiver('zip', {store: true});
    xpi.pipe(output);
    xpi.directory(`${__dirname}/${crxUnpackPath}/`, '/')
    xpi.finalize();
}

readCrxFile();
// log('tatus', 'Tasks finished. Terminating......');