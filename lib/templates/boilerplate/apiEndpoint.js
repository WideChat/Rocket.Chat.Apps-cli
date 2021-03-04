"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiEndpointTemplate = void 0;
const pascalCase = require("pascal-case");
exports.apiEndpointTemplate = (endpointClassName, path) => {
    return `
import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

export class ${pascalCase(endpointClassName)} extends ApiEndpoint {
    public path = '${path}';
    public example = [];

  public async get(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
                   http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }

  public async head(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
                    http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }

  public async options(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
                       http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }

  public async patch(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
                     http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }

  public post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
              http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }

  public put(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify,
             http: IHttp, persis: IPersistence): Promise<IApiResponse> {
    throw new Error('Method not implemented');
  }
}
`;
};
//# sourceMappingURL=apiEndpoint.js.map