"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const misc_1 = require("../misc");
const boilerplate_1 = require("../templates/boilerplate");
class Generate extends command_1.Command {
    constructor() {
        super(...arguments);
        this.ApiExtensionBoilerplate = async (fd) => {
            const name = await cli_ux_1.default.prompt(chalk_1.default.bold.greenBright('Name of endpoint class'));
            const path = await cli_ux_1.default.prompt(chalk_1.default.bold.greenBright('Path for endpoint'));
            const toWrite = boilerplate_1.apiEndpointTemplate(name, path);
            fd.generateEndpointClass(name, toWrite);
        };
        this.SlashCommandExtension = async (fd) => {
            const name = await cli_ux_1.default.prompt(chalk_1.default.bold.greenBright('Name of command class'));
            const toWrite = boilerplate_1.slashCommandTemplate(name);
            fd.generateCommandClass(name, toWrite);
        };
        this.SettingExtension = async (fd) => {
            let data = '';
            if (await fd.doesFileExist('settings.ts')) {
                data = fd.readSettingsFile();
            }
            if (data === '') {
                data = boilerplate_1.initialSettingTemplate();
            }
            data = boilerplate_1.appendNewSetting(data);
            fd.writeToSettingsFile(data);
        };
    }
    async run() {
        const { flags } = this.parse(Generate);
        const fd = new misc_1.FolderDetails(this);
        try {
            await fd.readInfoFile();
        }
        catch (e) {
            this.error(chalk_1.default.bold.red(e && e.message ? e.message : e));
        }
        let option = flags.options;
        const categories = [
            'Api Extension',
            'Slash Command Extension',
            'Settings Extension',
        ];
        if (!option) {
            inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
            const result = await inquirer.prompt([{
                    type: 'checkbox-plus',
                    name: 'categories',
                    message: 'Choose the boilerplate needed',
                    pageSize: 10,
                    highlight: true,
                    searchable: true,
                    validate: (answer) => {
                        if (answer.length === 0) {
                            return chalk_1.default.bold.redBright('You must choose at least one option.');
                        }
                        return true;
                    },
                    // tslint:disable:promise-function-async
                    source: (answersSoFar, input) => {
                        input = input || '';
                        return new Promise((resolve) => {
                            const fuzzyResult = fuzzy.filter(input, categories);
                            const data = fuzzyResult.map((element) => {
                                return element.original;
                            });
                            resolve(data);
                        });
                    },
                }]);
            option = result.categories[0];
        }
        switch (option) {
            case 'Api Extension':
                this.ApiExtensionBoilerplate(fd);
                break;
            case 'Slash Command Extension':
                this.SlashCommandExtension(fd);
                break;
            case 'Settings Extension':
                this.SettingExtension(fd);
                break;
            default:
                break;
        }
    }
}
exports.default = Generate;
Generate.description = 'Adds boilerplate code for various functions';
Generate.flags = {
    help: command_1.flags.help({ char: 'h' }),
    options: command_1.flags.string({
        char: 'o',
        // tslint:disable-next-line:max-line-length
        description: 'Choose the boilerplate needed a. Api Extension b. Slash Command Extension c. Settings Extension',
        options: ['a', 'b', 'c'],
    }),
};
//# sourceMappingURL=generate.js.map