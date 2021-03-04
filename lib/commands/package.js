"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const misc_1 = require("../misc");
class Package extends command_1.Command {
    async run() {
        cli_ux_1.default.action.start('packaging your app');
        const fd = new misc_1.FolderDetails(this);
        try {
            await fd.readInfoFile();
            await fd.matchAppsEngineVersion();
        }
        catch (e) {
            this.error(e && e.message ? e.message : e);
            return;
        }
        const compiler = new misc_1.AppCompiler(fd);
        const result = await compiler.compile();
        const { flags } = this.parse(Package);
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
        if (flags['no-compile']) {
            const packager = new misc_1.AppPackager(this, fd);
            zipName = await packager.zipItUp();
        }
        else {
            zipName = await compiler.outputZip();
        }
        cli_ux_1.default.action.stop('finished!');
        this.log(chalk_1.default.black(' '));
        this.log(chalk_1.default.green('App packaged up at:'), fd.mergeWithFolder(zipName));
    }
    reportDiagnostics(diag) {
        diag.forEach((d) => this.error(d.message));
    }
}
exports.default = Package;
Package.description = 'packages up your App in a distributable format';
Package.aliases = ['p', 'pack'];
Package.flags = {
    'help': command_1.flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    'no-compile': command_1.flags.boolean({
        description: "don't compile the source, package as is (for older Rocket.Chat versions)",
    }),
    'force': command_1.flags.boolean({
        char: 'f',
        description: 'forcefully package the App, ignores lint & TypeScript errors',
    }),
    'verbose': command_1.flags.boolean({
        char: 'v',
        description: 'show additional details about the results of running the command',
    }),
};
//# sourceMappingURL=package.js.map