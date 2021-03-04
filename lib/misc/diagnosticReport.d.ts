export declare class DiagnosticReport {
    private _options;
    private _syntactic;
    private _global;
    private _semantic;
    private _declaration;
    private _emit;
    private _isValid;
    constructor();
    get isValid(): boolean;
    set options(count: number);
    get options(): number;
    set syntactic(count: number);
    get syntactic(): number;
    set global(count: number);
    get global(): number;
    set semantic(count: number);
    get semantic(): number;
    set declaration(count: number);
    get declaration(): number;
    set emit(count: number);
    get emit(): number;
}
