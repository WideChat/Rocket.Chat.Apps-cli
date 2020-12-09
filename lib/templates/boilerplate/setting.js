"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendNewSetting = exports.initialSettingTemplate = void 0;
exports.initialSettingTemplate = () => {
    return `
import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';
export const settings: Array<ISetting> = [
];
`;
};
exports.appendNewSetting = (data) => {
    const toWrite = `
{
    id: '',
    type: SettingType.STRING,
    packageValue: '',
    required: false,
    public: false,
    i18nLabel: '',
    i18nDescription: '',
},
`;
    const index = data.lastIndexOf('];');
    return data.slice(0, index) + toWrite + data.slice(index);
};
//# sourceMappingURL=setting.js.map