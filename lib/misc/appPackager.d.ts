import Command from '@oclif/command';
import * as glob from 'glob';
import { FolderDetails } from './folderDetails';
export declare class AppPackager {
    private command;
    private fd;
    static GlobOptions: glob.IOptions;
    static PackagerInfo: {
        [key: string]: string;
    };
    constructor(command: Command, fd: FolderDetails);
    zipItUp(): Promise<string>;
    private asyncGlob;
    private asyncWriteZip;
}
