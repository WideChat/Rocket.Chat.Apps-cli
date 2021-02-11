"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const FormData = require("form-data");
const fs = require("fs");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const node_fetch_1 = require("node-fetch");
const misc_1 = require("../misc");
const cloudAuth_1 = require("../misc/cloudAuth");
class Submit extends command_1.Command {
    async run() {
        inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
        const { flags } = this.parse(Submit);
        //#region app packaging
        cli_ux_1.default.action.start(`${chalk_1.default.green('packaging')} your app`);
        const fd = new misc_1.FolderDetails(this);
        try {
            await fd.readInfoFile();
        }
        catch (e) {
            this.error(e && e.message ? e.message : e);
        }
        const compiler = new misc_1.AppCompiler(fd);
        const result = await compiler.compile();
        if (result.diagnostics.length) {
            this.reportDiagnostics(result.diagnostics);
            this.error('TypeScript compiler error(s) occurred');
            this.exit(1);
            return;
        }
        const packager = new misc_1.AppPackager(this, fd);
        const zipName = await packager.zipItUp();
        cli_ux_1.default.action.stop('packaged!');
        //#endregion
        //#region fetching categories
        cli_ux_1.default.action.start(`${chalk_1.default.green('fetching')} the available categories`);
        const categories = await misc_1.VariousUtils.fetchCategories();
        cli_ux_1.default.action.stop('fetched!');
        //#endregion
        //#region asking for information
        const cloudAuth = new cloudAuth_1.CloudAuth();
        const hasToken = await cloudAuth.hasToken();
        if (!hasToken) {
            const cloudAccount = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'hasAccount',
                    message: 'Have you logged into our Publisher Portal?',
                    default: true,
                }]);
            if (cloudAccount.hasAccount) {
                try {
                    cli_ux_1.default.action.start(chalk_1.default.green('*') + ' ' + chalk_1.default.gray('waiting for authorization...'));
                    await cloudAuth.executeAuthFlow();
                    cli_ux_1.default.action.stop(chalk_1.default.green('success!'));
                }
                catch (e) {
                    cli_ux_1.default.action.stop(chalk_1.default.red('failed to authenticate.'));
                    return;
                }
            }
            else {
                this.error('A Rocket.Chat Cloud account and a Marketplace Publisher account '
                    + 'is required to submit an App to the Marketplace. (rc-apps login)');
            }
        }
        if (typeof flags.update === 'undefined') {
            const isNewApp = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'isNew',
                    message: 'Is this a new App?',
                    default: true,
                }]);
            flags.update = !isNewApp.isNew;
        }
        let changes = '';
        if (flags.update) {
            const result = await inquirer.prompt([{
                    type: 'input',
                    name: 'changes',
                    message: 'What changes were made in this version?',
                }]);
            changes = result.changes;
        }
        else {
            const isFreeQuestion = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'isFree',
                    message: 'Is this App free or will it require payment?',
                    default: true,
                }]);
            if (!isFreeQuestion.isFree) {
                this.error('Paid Apps must be submitted via our Publisher Portal: '
                    + 'https://marketplace.rocket.chat/publisher/new/app');
            }
        }
        let selectedCategories = new Array();
        if (flags.categories) {
            selectedCategories = flags.categories.split(',');
        }
        else {
            const result = await inquirer.prompt([{
                    type: 'checkbox-plus',
                    name: 'categories',
                    message: 'Please select the categories which apply to this App?',
                    pageSize: 10,
                    highlight: true,
                    searchable: true,
                    validate: (answer) => {
                        if (answer.length === 0) {
                            return 'You must choose at least one color.';
                        }
                        return true;
                    },
                    // tslint:disable:promise-function-async
                    source: (_answersSoFar, input) => {
                        input = input || '';
                        return new Promise((resolve) => {
                            const fuzzyResult = fuzzy.filter(input, categories, {
                                extract: (item) => item.name,
                            });
                            const data = fuzzyResult.map((element) => {
                                return element.original;
                            });
                            resolve(data);
                        });
                    },
                }]);
            selectedCategories = result.categories;
        }
        const confirmSubmitting = await inquirer.prompt([{
                type: 'confirm',
                name: 'submit',
                message: 'Are you ready to submit?',
                default: false,
            }]);
        if (!confirmSubmitting.submit) {
            return;
        }
        //#endregion
        cli_ux_1.default.action.start(`${chalk_1.default.green('submitting')} your app`);
        const data = new FormData();
        data.append('app', fs.createReadStream(fd.mergeWithFolder(zipName)));
        data.append('categories', JSON.stringify(selectedCategories));
        if (changes) {
            data.append('changes', changes);
        }
        const token = await cloudAuth.getToken();
        await this.asyncSubmitData(data, flags, fd, token);
        cli_ux_1.default.action.stop('submitted!');
    }
    // tslint:disable:promise-function-async
    // tslint:disable-next-line:max-line-length
    async asyncSubmitData(data, flags, fd, token) {
        let url = 'https://marketplace.rocket.chat/v1/apps';
        if (flags.update) {
            url += `/${fd.info.id}`;
        }
        const headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        const res = await node_fetch_1.default(url, {
            method: 'POST',
            body: data,
            headers,
        });
        if (res.status !== 200) {
            const result = await res.json();
            if (result.code === 467 || result.code === 466) {
                throw new Error(result.error);
            }
            throw new Error(`Failed to submit the App. Error code ${result.code}: ${result.error}`);
        }
        else {
            return res.json();
        }
    }
    reportDiagnostics(diag) {
        diag.forEach((d) => this.error(d.message));
    }
}
exports.default = Submit;
Submit.description = 'submits an App to the Marketplace for review';
Submit.flags = {
    help: command_1.flags.help({ char: 'h' }),
    update: command_1.flags.boolean({ description: 'submits an update instead of creating one' }),
    categories: command_1.flags.string({
        char: 'c',
        description: 'a comma separated list of the categories for the App',
    }),
};
//# sourceMappingURL=submit.js.map