import { Command, flags } from '@oclif/command';
export default class Create extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        name: flags.IOptionFlag<string>;
        description: flags.IOptionFlag<string>;
        author: flags.IOptionFlag<string>;
        homepage: flags.IOptionFlag<string>;
        support: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
}
