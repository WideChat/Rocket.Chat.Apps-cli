import { Command, flags } from '@oclif/command';
export default class Generate extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        options: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
    private ApiExtensionBoilerplate;
    private SlashCommandExtension;
    private SettingExtension;
}
