import Command from '@oclif/command';
import * as FormData from 'form-data';
import { FolderDetails } from '.';
export declare const getServerInfo: (fd: FolderDetails, flags: {
    [key: string]: any;
}) => Promise<{
    [key: string]: any;
}>;
export declare const packageAndZip: (command: Command, fd: FolderDetails) => Promise<string>;
export declare const uploadApp: (flags: {
    [key: string]: any;
}, fd: FolderDetails, zipname: string) => Promise<void>;
export declare const checkUpload: (flags: {
    [key: string]: any;
}, fd: FolderDetails) => Promise<boolean>;
export declare const asyncSubmitData: (data: FormData, flags: {
    [key: string]: any;
}, fd: FolderDetails) => Promise<void>;
export declare const normalizeUrl: (url: string, path: string) => string;
export declare const getIgnoredFiles: (fd: FolderDetails) => Promise<Array<string>>;
