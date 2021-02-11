import { ICompilerResult } from '@rocket.chat/apps-compiler/definition';
import { FolderDetails } from './folderDetails';
export declare function getTypescriptForApp(fd: FolderDetails): any;
export declare class AppCompiler {
    private fd;
    private compiler;
    constructor(fd: FolderDetails);
    compile(): Promise<ICompilerResult>;
    outputZip(): Promise<string>;
}
