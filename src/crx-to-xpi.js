#! /usr/bin/env node

const fs = require('fs-extra');
const crx = require('unzip-crx');
const archiver = require('archiver');
const path = require('path');

const crxFilePath = process.argv[2];
const crxTempUnpackPath = '/tmp' + '/crx-to-xpi-temp';

var log = (type = 'status', content) => {
	if (type == 'error') {
		console.error(`Error: ${content}`);
	} else {
		console.log(`Status: ${content}`);
	}
};

var pushObject = (obj, key, value) => {
	obj[key] = value;
	return obj;
};

var readCrxFile = () => {
	if (path.extname(crxFilePath) == '.crx') {
		crx(crxFilePath, crxTempUnpackPath)
			.then(() => {
				log('status', 'Unpacking CRX file...')
				modifyManifest();
			})
			.catch((err) => {
				log('error', 'Failed to unpack CRX file');
				throw err;
			})
	} else {
		log('error', `\"${crxFilePath}\" is not a valid Chrome extension`);
		terminate();
	}
}

var modifyManifest = () => {
	fs.readFile(`${crxTempUnpackPath}/manifest.json`, 'utf8', (err, data) => {
		if (err) {
			log('error', 'Failed to read manifest.json from unpacked crx')
			throw err;
		} else {
			let manifestContent = JSON.parse(data);

			let declareGeckoSupport = {
				'gecko': {
					'id': `${manifestContent.name}@crx-to-xpi`
				}
			};
			// Infos that need to be pushed into "manifest.json"

			manifestContent = pushObject(manifestContent, 'applications', declareGeckoSupport);

			log('status', 'Trying to write modified manifests into manifest.json')
			fs.writeFile(`${crxTempUnpackPath}/manifest.json`, JSON.stringify(manifestContent), 'utf8', (err) => {
				if (err) {
					log('error', 'Failed to write manifests');
					throw err;
				} else {
					log('status', 'Manifests were written successfully')
					packXPI(manifestContent.name);
				}
			});
			// Write modified manifest
		}
	});
}

var packXPI = (name) => {
	let destPath = process.cwd();
	let xpiStream = fs.createWriteStream(`${destPath}/${name}.xpi`);
	let xpi = archiver('zip', {
		store: true
	});

	xpiStream.on('close', function () {
		log('status', 'XPI was packed and generated successfully');
		log('status', `XPI is located in \"${destPath}/${name}.xpi\"`)
		cleanupTempData()
	});
	xpi.on('error', function (err) {
		log('error', 'Failed to pack XPI from source code');
		terminate()
	});

	xpi.pipe(xpiStream);
	xpi.directory(crxTempUnpackPath, '/')
	xpi.finalize();

	log('status', 'Trying to pack XPI from source code')
}

var cleanupTempData = () => {
	fs.remove(crxTempUnpackPath, (err) => {
		if (err) {
			log('error', 'Failed to remove temp directory');
			throw err;
		} else {
			terminate();
		}
	});
}

var terminate = () => {
	log('status', 'Tasks finished. Terminating... Good Bye!');
}

readCrxFile();