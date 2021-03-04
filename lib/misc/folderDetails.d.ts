import Command from '@oclif/command';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
export declare class FolderDetails {
    private command;
    folder: string;
    toZip: string;
    infoFile: string;
    mainFile: string;
    info: IAppInfo;
    constructor(command: Command);
    doesFileExist(file: string): Promise<boolean>;
    mergeWithFolder(item: string): string;
    setFolder(folderPath: string): void;
    setAppInfo(appInfo: IAppInfo): void;
    generateDirectory(dirName: string): void;
    generateEndpointClass(name: string, toWrite: string): void;
    generateCommandClass(name: string, toWrite: string): void;
    readSettingsFile(): string;
    writeToSettingsFile(toWrite: string): void;
    /**
     * Validates the "app.json" file, loads it, and then retrieves the classFile property from it.
     * Throws an error when something isn't right.
     */
    readInfoFile(): Promise<void>;
    matchAppsEngineVersion(): Promise<void>;
    private validateAppDotJson;
    private isValidResult;
    private reportFailed;
    private reportError;
    private reportMissing;
    private updateInfoFileRequiredVersion;
}
