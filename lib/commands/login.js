"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const inquirer = require("inquirer");
const cloudAuth_1 = require("../misc/cloudAuth");
class Login extends command_1.Command {
    async run() {
        inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
        const cloudAuth = new cloudAuth_1.CloudAuth();
        const hasToken = await cloudAuth.hasToken();
        if (hasToken) {
            cli_ux_1.default.action.start(chalk_1.default.green('verifying') + ' your token...');
            try {
                await cloudAuth.getToken();
                cli_ux_1.default.action.stop(chalk_1.default.green('success, you are already logged in!'));
            }
            catch (e) {
                cli_ux_1.default.action.stop(chalk_1.default.red('failure.'));
            }
        }
        else {
            try {
                cli_ux_1.default.action.start(chalk_1.default.green('waiting') + ' for authorization...');
                await cloudAuth.executeAuthFlow();
                cli_ux_1.default.action.stop(chalk_1.default.green('success!'));
            }
            catch (e) {
                cli_ux_1.default.action.stop(chalk_1.default.red('failed to authenticate.'));
                return;
            }
        }
    }
}
exports.default = Login;
Login.description = 'steps through the process to log in with Rocket.Chat Cloud';
Login.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
//# sourceMappingURL=login.js.map