"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilerOptions = void 0;
const ts = require("typescript");
exports.compilerOptions = {
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    declaration: false,
    noImplicitAny: false,
    removeComments: true,
    strictNullChecks: true,
    noImplicitReturns: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
};
//# sourceMappingURL=compilerOptions.js.map