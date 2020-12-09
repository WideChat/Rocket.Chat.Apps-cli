import { Command, flags } from '@oclif/command';
export default class Deploy extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        url: flags.IOptionFlag<string>;
        username: flags.IOptionFlag<string>;
        password: flags.IOptionFlag<string>;
        token: flags.IOptionFlag<string>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        userid: flags.IOptionFlag<string>;
        force: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        update: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        code: flags.IOptionFlag<string>;
        i2fa: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
    private reportDiagnostics;
}
