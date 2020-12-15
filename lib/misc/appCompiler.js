"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCompiler = exports.getTypescriptForApp = void 0;
const path = require("path");
const apps_compiler_1 = require("@rocket.chat/apps-compiler");
/* import packageInfo = require('../package.json'); */
const packageInfo = {
    version: '1.7.0',
    name: '@rocket.chat/apps-cli',
};
// tslint:disable-next-line:no-var-requires
const createRequire = require('module').createRequire;
function getTypescriptForApp(fd) {
    const appRequire = createRequire(fd.mergeWithFolder('app.json'));
    return appRequire('typescript');
}
exports.getTypescriptForApp = getTypescriptForApp;
class AppCompiler {
    constructor(fd) {
        this.fd = fd;
        this.compiler = new apps_compiler_1.AppsCompiler({
            tool: packageInfo.name,
            version: packageInfo.version,
            when: new Date(),
        }, getTypescriptForApp(fd));
    }
    async compile() {
        return this.compiler.compile(this.fd.folder);
    }
    async outputZip() {
        const zipName = path.join('dist', `${this.fd.info.nameSlug}_${this.fd.info.version}.zip`);
        await this.compiler.outputZip(zipName);
        return zipName;
    }
}
exports.AppCompiler = AppCompiler;
//# sourceMappingURL=appCompiler.js.map