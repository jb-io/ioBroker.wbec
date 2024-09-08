// noinspection JSUnusedGlobalSymbols

import axios from 'axios';
import {
    BoxId, PvMode,
    WbecChargeLogResponse,
    WbecConfigResponse,
    WbecJsonResponse,
    WbecPvResponse,
    WbecStatusResponse
} from './wbecDeviceTypes';

export default class WbecDevice {
    private readonly _host: string;

    constructor(host: string) {
        this._host = host;
    }


    get host(): string {
        return 'http://' + this._host;
    }

    public async requestConfig(): Promise<WbecConfigResponse> {
        const response = await axios.get(this.host + '/cfg', {responseType: 'json'})
        return response.data as WbecConfigResponse;
    }

    private async requestGet<T>(uri: string): Promise<T> {
        const response = await axios.get(`${this.host}${uri}`, {responseType: 'json'});
        return response.data;
    }

    public async requestJson(id: BoxId | null = null): Promise<WbecJsonResponse> {
        const idQuery = id !== null ? `?id=${id}` : '';
        return this.requestGet<WbecJsonResponse>(`/json` + idQuery);
    }

    public async requestPv(): Promise<WbecPvResponse> {
        return this.requestGet<WbecPvResponse>(`/pv`);
    }

    public async requestStatus(id: BoxId): Promise<WbecStatusResponse> {
        return this.requestGet<WbecStatusResponse>(`/status?box=${id}`);
    }

    public async requestChargeLog(id: BoxId, length: number = 10): Promise<WbecChargeLogResponse> {
        return this.requestGet<WbecChargeLogResponse>(`/chargelog?id=${id}&len=${length}`);
    }

    public async setPvValue(parameters: {pvWbId?: BoxId, pvWatt?: number, pvBatt?: number, pvMode?: PvMode}): Promise<WbecPvResponse> {
        const queryParameters = [];
        for (const valueKey in parameters) {
            const value = parameters[valueKey as keyof typeof parameters];
            queryParameters.push(`${valueKey}=${value}`);
        }
        const queryString = queryParameters.join('&');
        console.log(queryString);
        return this.requestGet<WbecPvResponse>(`/pv?${queryString}`);
    }

    public async setCurrentLimit(id: BoxId, currentLimit: number): Promise<WbecJsonResponse> {
        const queryString = `?currLim=${currentLimit}&id=${id}`;
        return this.requestGet<WbecJsonResponse>(`/json` + queryString);
    }

    public async reset(): Promise<void> {
        await axios.get(this.host + '/reset');
    }

}
