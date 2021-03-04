import { IAppCategory } from './interfaces';
export declare class VariousUtils {
    static slugify: (text: string) => string;
    static getTsDefVersion: () => string;
    static fetchCategories(): Promise<Array<IAppCategory>>;
}
