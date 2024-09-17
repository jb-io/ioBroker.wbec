// noinspection JSUnusedGlobalSymbols

import axios from 'axios';
import {
    BoxId, ErrorHandler, PvMode,
    WbecChargeLogResponse,
    WbecConfigResponse,
    WbecJsonResponse,
    WbecPvResponse,
    WbecStatusResponse
} from './wbecDeviceTypes';

export default class WbecDevice {
    private readonly _host: string;
    private _errorHandler: null|ErrorHandler = null;
    private _errorBubbling: boolean = true;

    constructor(host: string) {
        this._host = host;
    }

    public setErrorHandler(onError: null | ErrorHandler, errorBubbling: boolean = false): void {
        this._errorHandler = onError;
        this._errorBubbling = errorBubbling;
    }


    get host(): string {
        return 'http://' + this._host;
    }

    private async requestGet<T>(uri: string, config?: axios.AxiosRequestConfig<any>): Promise<T> {
        return axios.get(`${this.host}${uri}`, {
            timeout: 2000,
            ...config,
        })
            .then(response => response.data)
            .catch((reason) => {
                if (this._errorHandler) {
                    this._errorHandler(reason);
                }
                if (this._errorBubbling) {
                    throw reason;
                }
            })
        ;
    }

    private async requestGetJsonResponse<T>(uri: string): Promise<T> {
        return this.requestGet(uri, {responseType: 'json'});
    }

    public async requestConfig(): Promise<WbecConfigResponse> {
        return this.requestGetJsonResponse<WbecConfigResponse>(`/cfg`);
    }

    public async requestJson(id: BoxId | null = null): Promise<WbecJsonResponse> {
        const idQuery = id !== null ? `?id=${id}` : '';
        return this.requestGetJsonResponse<WbecJsonResponse>(`/json` + idQuery);
    }

    public async requestPv(): Promise<WbecPvResponse> {
        return this.requestGetJsonResponse<WbecPvResponse>(`/pv`);
    }

    public async requestStatus(id: BoxId): Promise<WbecStatusResponse> {
        return this.requestGetJsonResponse<WbecStatusResponse>(`/status?box=${id}`);
    }

    public async requestChargeLog(id: BoxId, length: number = 10): Promise<WbecChargeLogResponse> {
        return this.requestGetJsonResponse<WbecChargeLogResponse>(`/chargelog?id=${id}&len=${length}`);
    }

    public async setPvValue(parameters: {pvWbId?: BoxId, pvWatt?: number, pvBatt?: number, pvMode?: PvMode}): Promise<WbecPvResponse> {
        const queryParameters = [];
        for (const valueKey in parameters) {
            const value = parameters[valueKey as keyof typeof parameters];
            queryParameters.push(`${valueKey}=${value}`);
        }
        const queryString = queryParameters.join('&');
        console.log(queryString);
        return this.requestGetJsonResponse<WbecPvResponse>(`/pv?${queryString}`);
    }

    public async setCurrentLimit(id: BoxId, currentLimit: number): Promise<WbecJsonResponse> {
        const queryString = `?currLim=${currentLimit}&id=${id}`;
        return this.requestGetJsonResponse<WbecJsonResponse>(`/json` + queryString);
    }

    public async reset(): Promise<void> {
        await this.requestGet('/reset');
    }

}
