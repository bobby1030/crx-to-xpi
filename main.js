#! /usr/bin/env node

const fs = require('fs');
const crx = require('unzip-crx');
const path = require('path')

var crxfilepath = process.argv[2];
var unpack_dest = process.argv[3] || `${path.basename(crxfilepath, '.crx')}_unzipped`;

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
    if (path.extname(crxfilepath) == '.crx') {
        crx(crxfilepath, unpack_dest)
            .then(() => {
                log('status', 'Unpacking CRX file.')
                modifyManifest()
            })
    } else {
        log('error', `\"${crxfilepath}\" is not a valid Chrome extension`);
    }
}

var modifyManifest = function() {
    var declareGeckoSupport = {
            'gecko': {
                'id': `${path.basename(crxfilepath, '.crx')}@crx-to-xpi`
            }
    };
    // Infos that need to be pushed into "manifest.json"

    fs.readFile(`${unpack_dest}/manifest.json`, 'utf8', (err, data) => {
        var manifestContent = JSON.parse(data);
        manifestContent = pushObject(manifestContent, 'applications', declareGeckoSupport);
        
        fs.writeFile(`${unpack_dest}/manifest.json`, JSON.stringify(manifestContent), 'utf8');
        console.log(manifestContent)
    })
}

readCrxFile();
// log('tatus', 'Tasks finished. Terminating......');