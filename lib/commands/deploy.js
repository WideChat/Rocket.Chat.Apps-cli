"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const semver = require("semver");
const misc_1 = require("../misc");
const deployHelpers_1 = require("../misc/deployHelpers");
class Deploy extends command_1.Command {
    async run() {
        const { flags } = this.parse(Deploy);
        const fd = new misc_1.FolderDetails(this);
        try {
            await fd.readInfoFile();
            await fd.matchAppsEngineVersion();
        }
        catch (e) {
            this.error(e && e.message ? e.message : e, { exit: 2 });
        }
        if (flags.i2fa) {
            flags.code = await cli_ux_1.default.prompt('2FA code', { type: 'hide' });
        }
        cli_ux_1.default.log(chalk_1.default.bold.greenBright('   Starting App Deployment to Server\n'));
        try {
            cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Getting Server Info'));
            const serverInfo = await deployHelpers_1.getServerInfo(fd, flags);
            cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
            cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Packaging the app'));
            const compiler = new misc_1.AppCompiler(fd);
            const result = await compiler.compile();
            if (flags.verbose) {
                this.log(`${chalk_1.default.green('[info]')} using TypeScript v${result.typeScriptVersion}`);
            }
            if (result.diagnostics.length && !flags.force) {
                this.reportDiagnostics(result.diagnostics);
                this.error('TypeScript compiler error(s) occurred');
                this.exit(1);
                return;
            }
            let zipName;
            if (semver.satisfies(semver.coerce(serverInfo.serverVersion), '>=3.8')) {
                zipName = await compiler.outputZip();
            }
            else {
                const packager = new misc_1.AppPackager(this, fd);
                zipName = await packager.zipItUp();
            }
            cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
            cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Uploading App'));
            await deployHelpers_1.uploadApp(serverInfo, fd, zipName);
            cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
        }
        catch (e) {
            cli_ux_1.default.action.stop(chalk_1.default.red(misc_1.unicodeSymbols.get('heavyMultiplicationX')));
            this.error(chalk_1.default.bold.redBright(`   ${misc_1.unicodeSymbols.get('longRightwardsSquiggleArrow')}  ${e && e.message ? e.message : e}`));
        }
    }
    reportDiagnostics(diag) {
        diag.forEach((d) => this.error(d.message));
    }
}
exports.default = Deploy;
Deploy.description = 'allows deploying an App to a server';
Deploy.flags = {
    help: command_1.flags.help({ char: 'h' }),
    url: command_1.flags.string({
        description: 'where the app should be deployed to',
    }),
    username: command_1.flags.string({
        char: 'u',
        description: 'username to authenticate with',
    }),
    password: command_1.flags.string({
        char: 'p',
        description: 'password for the user',
    }),
    token: command_1.flags.string({
        char: 't',
        description: 'API token to use with UserID (instead of username & password)',
    }),
    verbose: command_1.flags.boolean({
        char: 'v',
        description: 'show additional details about the results of running the command',
    }),
    userid: command_1.flags.string({
        char: 'i',
        description: 'UserID to use with API token (instead of username & password)',
    }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f', description: 'forcefully deploy the App, ignores lint & TypeScript errors' }),
    update: command_1.flags.boolean({ description: 'updates the app, instead of creating' }),
    code: command_1.flags.string({ char: 'c', dependsOn: ['username'], description: '2FA code of the user' }),
    i2fa: command_1.flags.boolean({ description: 'interactively ask for 2FA code' }),
};
//# sourceMappingURL=deploy.js.map