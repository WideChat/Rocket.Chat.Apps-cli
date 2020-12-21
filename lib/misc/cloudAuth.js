"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudAuth = void 0;
const hapi_1 = require("@hapi/hapi");
const axios_1 = require("axios");
const chalk_1 = require("chalk");
const cli_ux_1 = require("cli-ux");
const Conf = require("conf");
const crypto_1 = require("crypto");
const open = require("open");
const querystring_1 = require("querystring");
const systeminformation_1 = require("systeminformation");
const uuid_1 = require("uuid");
const cloudUrl = 'https://cloud.rocket.chat';
const clientId = '5d8e59c5d48080ef5497e522';
const scope = 'offline_access marketplace:app-submit';
class CloudAuth {
    constructor() {
        this.port = 3005;
        this.redirectUri = `http://localhost:${this.port}/callback`;
        this.codeVerifier = uuid_1.v4() + uuid_1.v4();
    }
    async executeAuthFlow() {
        await this.initialize();
        return new Promise((resolve, reject) => {
            try {
                this.server = new hapi_1.Server({ host: 'localhost', port: this.port });
                this.server.route({
                    method: 'GET',
                    path: '/callback',
                    handler: async (request) => {
                        try {
                            const code = request.query.code;
                            const token = await this.fetchToken(code);
                            resolve(token.access_token);
                            return 'Thank you. You can close this tab.';
                        }
                        catch (err) {
                            reject(err);
                        }
                        finally {
                            this.server.stop();
                        }
                    },
                });
                const codeChallenge = this.base64url(crypto_1.createHash('sha256').update(this.codeVerifier).digest('base64'));
                const authorizeUrl = this.buildAuthorizeUrl(codeChallenge);
                cli_ux_1.cli.log(chalk_1.default.green('*') + ' ' + chalk_1.default.white('...if your browser does not open, open this:')
                    + ' ' + chalk_1.default.underline(chalk_1.default.blue(authorizeUrl)));
                open(authorizeUrl);
                this.server.start();
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.log('Error inside of the execute:', e);
            }
        });
    }
    async hasToken() {
        await this.initialize();
        return this.config.has('rcc.token.access_token');
    }
    async getToken() {
        await this.initialize();
        const item = this.config.get('rcc');
        if (!item) {
            // when there isn't an item, we will not return anything or error out
            return '';
        }
        if (new Date() < new Date(item.expiresAt)) {
            return item.token.access_token;
        }
        await this.refreshToken();
        return this.config.get('rcc.token.access_token', '');
    }
    async revokeToken() {
        await this.initialize();
        const item = this.config.get('rcc');
        if (!item) {
            throw new Error('invalid cloud auth storage item');
        }
        await this.revokeTheToken();
    }
    async fetchToken(code) {
        try {
            const request = {
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
                client_id: clientId,
                code,
                code_verifier: this.codeVerifier,
            };
            const res = await axios_1.default.post(`${cloudUrl}/api/oauth/token`, querystring_1.stringify(request));
            const tokenInfo = res.data;
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + tokenInfo.expires_in);
            const storageItem = {
                token: tokenInfo,
                expiresAt,
            };
            this.config.set('rcc', storageItem);
            return tokenInfo;
        }
        catch (err) {
            const d = err.response.data;
            // tslint:disable-next-line:no-console
            console.log(`[${err.response.status}] error getting token: ${d.error} (${d.requestId})`);
            throw err;
        }
    }
    async refreshToken() {
        const refreshToken = this.config.get('rcc.token.refresh_token', '');
        const request = {
            client_id: clientId,
            refresh_token: refreshToken,
            scope,
            grant_type: 'refresh_token',
            redirect_uri: this.redirectUri,
        };
        try {
            const res = await axios_1.default.post(`${cloudUrl}/api/oauth/token`, querystring_1.stringify(request));
            const tokenInfo = res.data;
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + tokenInfo.expires_in);
            this.config.set('rcc.token.access_token', tokenInfo.access_token);
            this.config.set('rcc.token.expires_in', tokenInfo.expires_in);
            this.config.set('rcc.token.scope', tokenInfo.scope);
            this.config.set('rcc.token.token_type', tokenInfo.token_type);
            this.config.set('rcc.expiresAt', expiresAt);
        }
        catch (err) {
            const d = err.response.data;
            // tslint:disable-next-line:no-console
            console.log(`[${err.response.status}] error getting token refreshed: ${d.error} (${d.requestId})`);
            throw err;
        }
    }
    async revokeTheToken() {
        const refreshToken = this.config.get('rcc.token.refresh_token', '');
        const request = {
            client_id: clientId,
            token: refreshToken,
            token_type_hint: 'refresh_token',
        };
        try {
            await axios_1.default.post(`${cloudUrl}/api/oauth/revoke`, querystring_1.stringify(request));
            this.config.delete('rcc');
        }
        catch (err) {
            if (err.response.status === 401) {
                this.config.delete('rcc');
                return;
            }
            const d = err.response.data;
            // tslint:disable-next-line:no-console
            console.log(`[${err.response.status}] error revoking the token: ${d.error} (${d.requestId})`);
            throw err;
        }
    }
    buildAuthorizeUrl(codeChallenge) {
        const data = {
            client_id: clientId,
            response_type: 'code',
            scope,
            redirect_uri: this.redirectUri,
            state: uuid_1.v4(),
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
        };
        const params = querystring_1.stringify(data);
        const authorizeUrl = `${cloudUrl}/authorize?${params}`;
        return authorizeUrl;
    }
    async initialize() {
        if (typeof this.config !== 'undefined') {
            return;
        }
        this.config = new Conf({
            projectName: 'chat.rocket.apps-cli',
            encryptionKey: await this.getEncryptionKey(),
        });
    }
    async getEncryptionKey() {
        const s = await systeminformation_1.system();
        const c = await systeminformation_1.cpu();
        const m = await systeminformation_1.mem();
        const o = await systeminformation_1.osInfo();
        return s.manufacturer + ';' + s.uuid + ';' + String(c.processors) + ';'
            + c.vendor + ';' + m.total + ';' + o.platform + ';' + o.release;
    }
    // base64url - https://base64.guru/standards/base64url
    base64url(url) {
        return url.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
}
exports.CloudAuth = CloudAuth;
//# sourceMappingURL=cloudAuth.js.map