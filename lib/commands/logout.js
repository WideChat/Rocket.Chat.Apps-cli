"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const inquirer = require("inquirer");
const cloudAuth_1 = require("../misc/cloudAuth");
class Logout extends command_1.Command {
    async run() {
        inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
        const cloudAuth = new cloudAuth_1.CloudAuth();
        const hasToken = await cloudAuth.hasToken();
        if (hasToken) {
            cli_ux_1.default.action.start(chalk_1.default.red('revoking') + ' your credentials...');
            try {
                await cloudAuth.revokeToken();
                cli_ux_1.default.action.stop(chalk_1.default.green('success!'));
            }
            catch (e) {
                cli_ux_1.default.action.stop(chalk_1.default.red('failure?'));
            }
        }
        else {
            cli_ux_1.default.log(chalk_1.default.red('no Rocket.Chat Cloud credentials to revoke'));
        }
    }
}
exports.default = Logout;
Logout.description = 'revokes the Rocket.Chat Cloud credentials';
Logout.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
//# sourceMappingURL=logout.js.map