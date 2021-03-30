import { Command, flags } from '@oclif/command';
export default class Submit extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        update: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        categories: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
    private asyncSubmitData;
    private reportDiagnostics;
}
