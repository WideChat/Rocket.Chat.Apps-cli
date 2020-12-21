"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticReport = void 0;
class DiagnosticReport {
    constructor() {
        this._options = 0;
        this._syntactic = 0;
        this._global = 0;
        this._semantic = 0;
        this._declaration = 0;
        this._emit = 0;
        this._isValid = true;
    }
    get isValid() {
        return this._isValid;
    }
    set options(count) {
        this._options = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get options() {
        return this._options;
    }
    set syntactic(count) {
        this._syntactic = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get syntactic() {
        return this._syntactic;
    }
    set global(count) {
        this._global = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get global() {
        return this._global;
    }
    set semantic(count) {
        this._semantic = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get semantic() {
        return this._semantic;
    }
    set declaration(count) {
        this._declaration = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get declaration() {
        return this._declaration;
    }
    set emit(count) {
        this._emit = count;
        if (count > 0) {
            this._isValid = false;
        }
    }
    get emit() {
        return this._emit;
    }
}
exports.DiagnosticReport = DiagnosticReport;
//# sourceMappingURL=diagnosticReport.js.map