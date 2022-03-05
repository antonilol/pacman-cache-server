import { createServer } from 'http';
import { request } from 'https';
import { createWriteStream, WriteStream, createReadStream, readFileSync, existsSync } from 'fs';
import * as path from 'path';

interface Config {
	port: number,
	mirror: string,
	mirrorPath?: string,
	cacheDir: string,
	cacheFiles: string[]
}

var config: Config;
try {
	config = JSON.parse(readFileSync('config.json').toString());
}
catch (e) {
	console.error(e);
	console.error('Using sample config instead');
	config = JSON.parse(readFileSync('config.sample.json').toString());
}

const server = createServer((req, res) => {
	const name = path.join(config.cacheDir, path.basename(req.url));
	var doCache = !!config.cacheFiles.find(x => name.endsWith(x));
	if (doCache && existsSync(name)) {
		res.writeHead(200);
		const stream = createReadStream(name);
		stream.on('data', chunk => {
		  res.write(chunk);
		});
		stream.on('end', () => {
		  res.end();
		});
		stream.on('error', e => {
			res.end();
		  console.error('Read stream error', name);
			console.error(e);
		});
	} else {
		request({ host: config.mirror, path: (config.mirrorPath || '') + req.url }, mirrorRes => {
			var stream: WriteStream | undefined;
			if (doCache) {
			  stream = createWriteStream(name);
				stream.on('error', e => {
					console.error(e);
					console.error('Failed to open file for writing, make sure you have sudo privileges if needed');
					doCache = false;
				})
			}
			// console.log(`${req.method} ${mirrorRes.statusCode} ${req.url}`); // DEBUG
			res.writeHead(mirrorRes.statusCode);
			mirrorRes.on('data', chunk => {
				if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string') {
					console.error('chunk is not a Buffer or string');
					process.exit(1);
				}
		    res.write(chunk);
				if (doCache) {
					stream.write(chunk);
				}
		  });
		  mirrorRes.on('end', () => {
		    res.end();
				if (doCache) {
					stream.end();
				}
		  });
		}).end();
	}
});

server.listen(config.port);
