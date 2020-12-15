"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const pascalCase = require("pascal-case");
const path = require("path");
const semver = require("semver");
const uuid = require("uuid");
const misc_1 = require("../misc");
class Create extends command_1.Command {
    async run() {
        if (!semver.satisfies(process.version, '>=4.2.0')) {
            this.error('NodeJS version needs to be at least 4.2.0 or higher.');
            return;
        }
        const info = {
            id: uuid.v4(),
            version: '0.0.1',
            requiredApiVersion: misc_1.VariousUtils.getTsDefVersion(),
            iconFile: 'icon.png',
            author: {},
        };
        this.log('Let\'s get started creating your app.');
        this.log('We need some information first:');
        this.log('');
        const { flags } = this.parse(Create);
        info.name = flags.name ? flags.name : await cli_ux_1.default.prompt(chalk_1.default.bold('   App Name'));
        info.nameSlug = misc_1.VariousUtils.slugify(info.name);
        info.classFile = `${pascalCase(info.name)}App.ts`;
        info.description = flags.description ? flags.description : await cli_ux_1.default.prompt(chalk_1.default.bold('   App Description'));
        info.author.name = flags.author ? flags.author : await cli_ux_1.default.prompt(chalk_1.default.bold('   Author\'s Name'));
        info.author.homepage = flags.homepage ? flags.homepage : await cli_ux_1.default.prompt(chalk_1.default.bold('   Author\'s Home Page'));
        info.author.support = flags.support ? flags.support : await cli_ux_1.default.prompt(chalk_1.default.bold('   Author\'s Support Page'));
        const folder = path.join(process.cwd(), info.nameSlug);
        cli_ux_1.default.action.start(`Creating a Rocket.Chat App in ${chalk_1.default.green(folder)}`);
        const fd = new misc_1.FolderDetails(this);
        fd.setAppInfo(info);
        fd.setFolder(folder);
        const creator = new misc_1.AppCreator(fd, this);
        await creator.writeFiles();
        try {
            await fd.readInfoFile();
        }
        catch (e) {
            this.error(e && e.message ? e.message : e);
            return;
        }
        cli_ux_1.default.action.stop(chalk_1.default.cyan('done!'));
    }
}
exports.default = Create;
Create.description = 'simplified way of creating an app';
Create.flags = {
    help: command_1.flags.help({ char: 'h' }),
    name: command_1.flags.string({ char: 'n', description: 'Name of the app' }),
    description: command_1.flags.string({ char: 'd', description: 'Description of the app' }),
    author: command_1.flags.string({ char: 'a', description: 'Author\'s name' }),
    homepage: command_1.flags.string({ char: 'H', description: 'Author\'s or app\'s home page' }),
    support: command_1.flags.string({ char: 's', description: 'URL or email address to get support for the app' }),
};
//# sourceMappingURL=create.js.map