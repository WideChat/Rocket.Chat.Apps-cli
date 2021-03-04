"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigTemplate = void 0;
exports.tsConfigTemplate = () => {
    return `{
"compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "removeComments": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    },
"include": [
    "**/*.ts"
    ]
}
`;
};
//# sourceMappingURL=tsConfigTemplate.js.map