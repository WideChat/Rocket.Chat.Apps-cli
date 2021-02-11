"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderDetails = void 0;
const chalk_1 = require("chalk");
const figures = require("figures");
const fs = require("fs-extra");
const path = require("path");
const process = require("process");
const semver_1 = require("semver");
const tv4 = require("tv4");
const appJsonSchema_1 = require("./appJsonSchema");
class FolderDetails {
    constructor(command) {
        this.command = command;
        this.setFolder(process.cwd());
        this.mainFile = '';
        this.info = {};
    }
    async doesFileExist(file) {
        return await fs.pathExists(file) && fs.statSync(file).isFile();
    }
    mergeWithFolder(item) {
        return path.join(this.folder, item);
    }
    setFolder(folderPath) {
        this.folder = folderPath;
        this.toZip = path.join(this.folder, '{,!(node_modules|test)/**/}*.*');
        this.infoFile = path.join(this.folder, 'app.json');
    }
    setAppInfo(appInfo) {
        this.info = appInfo;
    }
    generateDirectory(dirName) {
        const dirPath = path.join(this.folder, dirName);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    }
    generateEndpointClass(name, toWrite) {
        const dir = 'endpoints';
        const dirPath = path.join(this.folder, dir);
        this.generateDirectory(dir);
        fs.writeFileSync(path.join(dirPath, `${name}.ts`), toWrite, 'utf8');
    }
    generateCommandClass(name, toWrite) {
        const dir = 'slashCommands';
        const dirPath = path.join(this.folder, dir);
        this.generateDirectory(dir);
        fs.writeFileSync(path.join(dirPath, `${name}.ts`), toWrite, 'utf8');
    }
    readSettingsFile() {
        return fs.readFileSync(path.join(this.folder, 'settings.ts'), 'utf-8');
    }
    writeToSettingsFile(toWrite) {
        fs.writeFileSync(path.join(this.folder, 'settings.ts'), toWrite, 'utf-8');
    }
    /**
     * Validates the "app.json" file, loads it, and then retrieves the classFile property from it.
     * Throws an error when something isn't right.
     */
    async readInfoFile() {
        if (!(await this.doesFileExist(this.infoFile))) {
            throw new Error('No App found to package. Missing an "app.json" file.');
        }
        try {
            this.info = require(this.infoFile);
        }
        catch (e) {
            throw new Error('The "app.json" file is invalid.');
        }
        // This errors out if it fails
        this.validateAppDotJson();
        if (!this.info.classFile) {
            throw new Error('Invalid "app.json" file. The "classFile" is required.');
        }
        this.mainFile = path.join(this.folder, this.info.classFile);
        if (!(await this.doesFileExist(this.mainFile))) {
            throw new Error(`The specified classFile (${this.mainFile}) does not exist.`);
        }
    }
    async matchAppsEngineVersion() {
        // WIDECHAT
        // as we are using git url as dependency in package.json, it always throughs error
        return;
        if (!this.info) {
            throw new Error('App Manifest not loaded. Exiting...');
        }
        if (!await this.doesFileExist('package.json')) {
            throw new Error('package.json not found. Exiting...');
        }
        const packageJson = require(path.join(this.folder, 'package.json'));
        const appsEngineVersion = packageJson.devDependencies['@rocket.chat/apps-engine'];
        if (semver_1.diff(semver_1.coerce(appsEngineVersion), semver_1.coerce(this.info.requiredApiVersion))) {
            // tslint:disable-next-line:no-console
            console.log(chalk_1.default.bgYellow('Warning:'), chalk_1.default.yellow('Different versions of the Apps Engine were found between app.json (', this.info.requiredApiVersion, ') and package.json (', appsEngineVersion, ').', '\nUpdating app.json to reflect the same version of Apps Engine from package.json'));
            await this.updateInfoFileRequiredVersion(appsEngineVersion);
        }
    }
    validateAppDotJson() {
        const result = tv4.validateMultiple(this.info, appJsonSchema_1.appJsonSchema);
        // We only care if the result is invalid, as it should pass successfully
        if (!this.isValidResult(result)) {
            this.reportFailed(result.errors.length, result.missing.length);
            result.errors.forEach((e) => this.reportError(e));
            result.missing.forEach((v) => this.reportMissing(v));
            throw new Error('Invalid "app.json" file, please ensure it matches the schema. (TODO: insert link here)');
        }
    }
    isValidResult(result) {
        return result.valid && result.missing.length === 0;
    }
    reportFailed(errorCount, missingCount) {
        const results = [];
        if (errorCount > 0) {
            results.push(chalk_1.default.red(`${errorCount} validation error(s)`));
        }
        if (missingCount > 0) {
            results.push(chalk_1.default.red(`${missingCount} missing schema(s)`));
        }
        this.command.log(chalk_1.default.red(figures.cross), chalk_1.default.cyan(this.infoFile), results.length > 0 ? `has ${results.join(' and ')}` : '');
    }
    reportError(error, indent = '  ') {
        this.command.log(indent, chalk_1.default.red(`${figures.pointerSmall} Error:`), error.message || 'No error message provided by validation module');
        this.command.log(indent, '  at', chalk_1.default.blue(error.dataPath || '/'), 'against schema', chalk_1.default.blue(error.schemaPath || '/'));
        if (error.subErrors) {
            error.subErrors.forEach((err) => this.reportError(err, `${indent}  `));
        }
    }
    reportMissing(uri, indent = '  ') {
        this.command.log(indent, chalk_1.default.red(`${figures.pointerSmall} Missing:`), uri);
    }
    async updateInfoFileRequiredVersion(requiredApiVersion) {
        const info = Object.assign(Object.assign({}, this.info), { requiredApiVersion });
        await fs.writeFile(path.join(this.folder, 'app.json'), JSON.stringify(info), 'utf-8');
        await this.readInfoFile();
    }
}
exports.FolderDetails = FolderDetails;
//# sourceMappingURL=folderDetails.js.map