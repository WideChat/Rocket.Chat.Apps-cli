export interface ICloudToken {
    access_token: string;
    expires_in: number;
    scope: string;
    refresh_token: string;
    token_type: string;
}
export interface ICloudAuthStorage {
    token: ICloudToken;
    expiresAt: Date;
}
export declare class CloudAuth {
    private config;
    private codeVerifier;
    private port;
    private server;
    private redirectUri;
    constructor();
    executeAuthFlow(): Promise<string>;
    hasToken(): Promise<boolean>;
    getToken(): Promise<string>;
    revokeToken(): Promise<void>;
    private fetchToken;
    private refreshToken;
    private revokeTheToken;
    private buildAuthorizeUrl;
    private initialize;
    private getEncryptionKey;
    private base64url;
}
