import { Command, flags } from '@oclif/command';
export default class Watch extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        url: flags.IOptionFlag<string>;
        username: flags.IOptionFlag<string>;
        password: flags.IOptionFlag<string>;
        token: flags.IOptionFlag<string>;
        userid: flags.IOptionFlag<string>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        force: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        code: flags.IOptionFlag<string>;
        i2fa: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
