"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariousUtils = void 0;
const fs = require("fs");
const node_fetch_1 = require("node-fetch");
class VariousUtils {
    // tslint:disable:promise-function-async
    static async fetchCategories() {
        const cats = await node_fetch_1.default('https://marketplace.rocket.chat/v1/categories').then((res) => res.json());
        const categories = cats.map((c) => {
            return {
                title: c.title,
                description: c.description,
                name: c.title,
                value: c.title,
            };
        });
        return categories;
    }
}
exports.VariousUtils = VariousUtils;
VariousUtils.slugify = function _slugify(text) {
    return text.toString().toLowerCase().replace(/^\s+|\s+$/g, '')
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of textte
};
VariousUtils.getTsDefVersion = function _getTsDefVersion() {
    const devLocation = 'node_modules/@rocket.chat/apps-engine/package.json';
    if (fs.existsSync(devLocation)) {
        const info = JSON.parse(fs.readFileSync(devLocation, 'utf8'));
        return '^' + info.version;
    }
    return '^1.4.0';
};
//# sourceMappingURL=variousUtils.js.map