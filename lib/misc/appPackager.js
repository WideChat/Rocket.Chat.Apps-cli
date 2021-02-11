"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPackager = void 0;
const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");
const Yazl = require("yazl");
/* import packageInfo = require('../package.json'); */
const packageInfo = {
    version: '1.7.0',
    name: '@rocket.chat/apps-cli',
};
class AppPackager {
    constructor(command, fd) {
        this.command = command;
        this.fd = fd;
    }
    async zipItUp() {
        let matches;
        try {
            matches = await this.asyncGlob();
        }
        catch (e) {
            this.command.warn(`Failed to retrieve the list of files for the App ${this.fd.info.name}.`);
            throw e;
        }
        // Ensure we have some files to package up before we do the packaging
        if (matches.length === 0) {
            throw new Error('No files to package were found');
        }
        const zipName = path.join('dist', `${this.fd.info.nameSlug}_${this.fd.info.version}.zip`);
        const zip = new Yazl.ZipFile();
        zip.addBuffer(Buffer.from(JSON.stringify(AppPackager.PackagerInfo)), '.packagedby', { compress: true });
        for (const realPath of matches) {
            const zipPath = path.relative(this.fd.folder, realPath);
            const fileStat = await fs.stat(realPath);
            const options = {
                compress: true,
                mtime: fileStat.mtime,
                mode: fileStat.mode,
            };
            zip.addFile(realPath, zipPath, options);
        }
        zip.end();
        await this.asyncWriteZip(zip, zipName);
        return zipName;
    }
    // tslint:disable-next-line:promise-function-async
    asyncGlob() {
        return new Promise((resolve, reject) => {
            glob(this.fd.toZip, AppPackager.GlobOptions, (err, matches) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(matches);
            });
        });
    }
    // tslint:disable-next-line:promise-function-async
    asyncWriteZip(zip, zipName) {
        return new Promise((resolve) => {
            fs.mkdirpSync(this.fd.mergeWithFolder('dist'));
            const realPath = this.fd.mergeWithFolder(zipName);
            zip.outputStream.pipe(fs.createWriteStream(realPath)).on('close', resolve);
        });
    }
}
exports.AppPackager = AppPackager;
AppPackager.GlobOptions = {
    dot: false,
    silent: true,
    ignore: [
        '**/README.md',
        '**/tslint.json',
        '**/package-lock.json',
        '**/tsconfig.json',
        '**/*.js',
        '**/*.js.map',
        '**/*.d.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/dist/**',
        '**/.*',
    ],
};
AppPackager.PackagerInfo = {
    tool: packageInfo.name,
    version: packageInfo.version,
};
//# sourceMappingURL=appPackager.js.map