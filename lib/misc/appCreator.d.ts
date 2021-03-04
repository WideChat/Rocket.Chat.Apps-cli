import Command from '@oclif/command';
import { FolderDetails } from './folderDetails';
export declare class AppCreator {
    private fd;
    private command;
    constructor(fd: FolderDetails, command: Command);
    writeFiles(): Promise<void>;
    private createAppJson;
    private createServerInfoJson;
    private createMainTypeScriptFile;
    private createBlankIcon;
    private createdReadme;
    private createTsConfig;
    private createTsLintConfig;
    private createPackageJson;
    private createGitIgnore;
    private createEditorConfig;
    private createVsCodeExts;
    private runNpmInstall;
}
