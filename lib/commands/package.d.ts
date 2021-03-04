import { Command } from '@oclif/command';
export default class Package extends Command {
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        'no-compile': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        force: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
    private reportDiagnostics;
}
