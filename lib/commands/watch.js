"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const chokidar = require("chokidar");
const cli_ux_1 = require("cli-ux");
const misc_1 = require("../misc");
const deployHelpers_1 = require("../misc/deployHelpers");
class Watch extends command_1.Command {
    async run() {
        const { flags } = this.parse(Watch);
        const fd = new misc_1.FolderDetails(this);
        try {
            await fd.readInfoFile();
        }
        catch (e) {
            this.error(chalk_1.default.bold.red(e && e.message ? e.message : e), { exit: 2 });
        }
        if (flags.i2fa) {
            flags.code = await cli_ux_1.default.prompt('2FA code', { type: 'hide' });
        }
        let ignoredFiles;
        try {
            ignoredFiles = await deployHelpers_1.getIgnoredFiles(fd);
        }
        catch (e) {
            this.error(chalk_1.default.bold.red(e && e.message ? e.message : e));
        }
        chokidar.watch(fd.folder, {
            ignored: ignoredFiles,
            awaitWriteFinish: true,
            persistent: true,
            interval: 300,
        }).on('change', async () => {
            tasks(this, fd, flags)
                .catch((e) => {
                this.log(chalk_1.default.bold.redBright(`   ${misc_1.unicodeSymbols.get('longRightwardsSquiggleArrow')}  ${e && e.message ? e.message : e}`));
            });
        }).on('ready', async () => {
            tasks(this, fd, flags)
                .catch((e) => {
                this.log(chalk_1.default.bold.redBright(`   ${misc_1.unicodeSymbols.get('longRightwardsSquiggleArrow')}  ${e && e.message ? e.message : e}`));
            });
        });
    }
}
exports.default = Watch;
Watch.description = 'watches for changes in the app and redeploys to the server';
Watch.flags = {
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
    userid: command_1.flags.string({
        char: 'i',
        description: 'UserID to use with API token (instead of username & password)',
    }),
    verbose: command_1.flags.boolean({
        char: 'v',
        description: 'show additional details about the results of running the command',
    }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f', description: 'forcefully deploy the App, ignores lint & TypeScript errors' }),
    code: command_1.flags.string({ char: 'c', dependsOn: ['username'], description: '2FA code of the user' }),
    i2fa: command_1.flags.boolean({ description: 'interactively ask for 2FA code' }),
};
function reportDiagnostics(command, diag) {
    diag.forEach((d) => command.error(d.message));
}
const tasks = async (command, fd, flags) => {
    try {
        cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Packaging the app'));
        const compiler = new misc_1.AppCompiler(fd);
        const result = await compiler.compile();
        if (flags.verbose) {
            command.log(`${chalk_1.default.green('[info]')} using TypeScript v${result.typeScriptVersion}`);
        }
        if (result.diagnostics.length && !flags.force) {
            reportDiagnostics(command, result.diagnostics);
            command.error('TypeScript compiler error(s) occurred');
            command.exit(1);
            return;
        }
        const zipName = await compiler.outputZip();
        cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
        cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Getting Server Info'));
        const serverInfo = await deployHelpers_1.getServerInfo(fd, flags);
        cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
        const status = await deployHelpers_1.checkUpload(Object.assign(Object.assign({}, flags), serverInfo), fd);
        if (status) {
            cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Updating App'));
            await deployHelpers_1.uploadApp(Object.assign(Object.assign({}, serverInfo), { update: true }), fd, zipName);
            cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
        }
        else {
            cli_ux_1.default.action.start(chalk_1.default.bold.greenBright('   Uploading App'));
            await deployHelpers_1.uploadApp(serverInfo, fd, zipName);
            cli_ux_1.default.action.stop(chalk_1.default.bold.greenBright(misc_1.unicodeSymbols.get('checkMark')));
        }
    }
    catch (e) {
        cli_ux_1.default.action.stop(chalk_1.default.red(misc_1.unicodeSymbols.get('heavyMultiplicationX')));
        throw new Error(e);
    }
};
//# sourceMappingURL=watch.js.map