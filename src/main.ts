/*
 * Created with @iobroker/create-adapter v2.6.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

// Load your modules here:
import WbecDevice from './wbecDevice';
import {Box, BoxId, Pv, PvMode, WbecConfigResponse} from './wbecDeviceTypes';
import _ from 'lodash';

class Wbec extends utils.Adapter {

   private requestInterval: ReturnType<typeof this.setInterval> = undefined;
   private updateTimeout: ReturnType<typeof this.setTimeout> = undefined;

   private _wbecDevice: WbecDevice|null = null;
   private _wbecConfig: WbecConfigResponse|null = null;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'wbec',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.update = _.throttle(this.update.bind(this),1000);
    }


    get wbecDevice(): WbecDevice {
        return this._wbecDevice as WbecDevice;
    }

    get wbecConfig(): WbecConfigResponse {
        return this._wbecConfig as WbecConfigResponse;
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // Reset the connection indicator during startup
        await this.setState('info.connection', false, true);

        if (!this.config.host) {
            return;
        }

        // Get wbec config or return on error
        try {
            this._wbecDevice = new WbecDevice(this.config.host);
            this._wbecDevice.setErrorHandler((error) => {
                this.log.error(error);
                this.setState('info.connection', false, true);
            })
            this._wbecConfig = await this.wbecDevice.requestConfig();
        } catch (e) {
            this.log.error(`${e}`);
            return;
        }

        if (this.config.energyMeterId) {
            this.onEnergyMeterChange = _.throttle(this.onEnergyMeterChange.bind(this),this.wbecConfig.cfgPvCycleTime*1000);
            this.subscribeForeignStates(this.config.energyMeterId);
        }

        await this.createConfigStates();
        await this.createStates();

        this.requestInterval = this.setInterval(this.onInterval.bind(this), this.config.requestInterval * 1000);
        this.update();

        for (let boxId: BoxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
            this.setTimeout(() => this.updateChargeLog(boxId as BoxId), (3+boxId) * 1000);
        }
    }

    private update(): void {
        this.updateTimeout = this.setTimeout(this.onInterval.bind(this), 1000);
    }

    private async onInterval(): Promise<void> {
        try {
            const response = await this.wbecDevice.requestJson();

            await this.setState('info.connection', true, true);

            for (const boxKey in response.box) {
                const boxState = response.box[boxKey];
                if (boxState) {
                    for (const state in boxState) {
                        let val = boxState[state as keyof Box] as ioBroker.StateValue;
                        switch (state as keyof Box) {
                            case 'currLim':
                            case 'currFs':
                            case 'currL1':
                            case 'currL2':
                            case 'currL3':
                            case 'lmReq':
                            case 'lmLim':
                            case 'pcbTemp':
                                val = val ? (val as number) / 10 : val;
                                break;
                        }
                        await this.setState(`box${boxKey}.${state}`, val, true);
                    }
                    let phases = 0;
                    for (const key of ['currL1', 'currL2', 'currL3']) {
                        if (+boxState[key as keyof Box] > 60) {
                            phases++;
                        }
                    }
                    await this.setState(`box${boxKey}.phases`, phases, true);
                }
            }
            for (const key in response.rfid) {
                const val = response.rfid[key as keyof typeof response.rfid] as ioBroker.StateValue;
                await this.setState(`rfid.${key}`, val, true);
            }
            for (const key in response.wbec) {
                const val = response.wbec[key as keyof typeof response.wbec] as ioBroker.StateValue;
                await this.setState(`wbec.${key}`, val, true);
            }
            for (const key in response.pv) {
                const val = response.pv[key as keyof typeof response.pv] as ioBroker.StateValue;
                await this.setState(`pv.${key}`, val, true);
            }
            for (const key in response.wifi) {
                const val = response.wifi[key as keyof  typeof response.wifi] as ioBroker.StateValue;
                await this.setState(`wifi.${key}`, val, true);
            }
            for (const key in response.modbus.state) {
                const val = response.modbus.state[key as keyof  typeof response.modbus.state] as ioBroker.StateValue;
                await this.setState(`modbus.state.${key}`, val, true);
            }
        } catch {
            await this.setState('info.connection', false, true);
        }
    }

    private async updateChargeLog(boxId: BoxId): Promise<void> {
        this.log.debug(`Update charge log for Box: ${boxId}`);
        const chargeLog = await this.wbecDevice.requestChargeLog(boxId, 10);

        const chargeLogPrefix = `box${boxId}.chargeLog`;
        await this.delObjectAsync(chargeLogPrefix, {recursive: true});

        let index = chargeLog.line.length - 1;
        for (const line of chargeLog.line) {
            const idPrefix = `${chargeLogPrefix}.${index--}`;

            await this.extendObject(idPrefix+ '.timestamp', {
                type: 'state',
                common: {
                    name: 'Zeitstempel',
                    type: 'number',
                    role: 'timestamp',
                    write: false,
                }
            }).then(() => this.setState(idPrefix+'.timestamp', line.timestamp, true));

            await this.extendObject(idPrefix+ '.duration', {
                type: 'state',
                common: {
                    name: 'Ladedauer',
                    type: 'number',
                    role: 'interval',
                    unit: 's',
                    write: false,
                }
            }).then(() => this.setState(idPrefix+'.duration', line.duration, true));

            await this.extendObject(idPrefix+ '.energy', {
                type: 'state',
                common: {
                    name: 'Lademenge',
                    type: 'number',
                    role: 'value.energy',
                    unit: 'Wh',
                    write: false,
                }
            }).then(() => this.setState(idPrefix+'.energy', line.energy, true));

            await this.extendObject(idPrefix+ '.user', {
                type: 'state',
                common: {
                    name: 'Benutzer',
                    type: 'number',
                    role: 'value',
                    write: false,
                }
            }).then(() => this.setState(idPrefix+'.user', line.user, true));
        }

    }

    private async onBoxStateChange(boxId: BoxId, parameter: keyof Box, state: ioBroker.State): Promise<void> {
        switch (parameter) {
            case 'currLim': {
                await this.wbecDevice.setCurrentLimit(boxId, (state.val as number) * 10);
                break;
            }
            case 'chgStat': {
                this.setTimeout(() => this.updateChargeLog(boxId), 1000);
                break;
            }
        }
    }

    private async onPvStateChange(parameter: keyof Pv, state: ioBroker.State): Promise<void> {
        const value = state.val;
        switch (parameter) {
            case 'mode': {
                await this.wbecDevice.setPvValue({pvMode: value as PvMode});
                break;
            }
            case 'watt': {
                await this.wbecDevice.setPvValue({pvWatt: value as number});
                break;
            }
            case 'wbId': {
                await this.wbecDevice.setPvValue({pvWbId: value as BoxId});
                break;
            }
        }
    }

    private async onEnergyMeterChange(state: ioBroker.State): Promise<void> {
        if (state.ack && null !== state.val) {
            this.log.info(JSON.stringify(await this.wbecDevice.setPvValue({pvWatt: +state.val})));
        }
    }

    /**
     * Is called if a subscribed state changes
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (state) {
            if (id === this.config.energyMeterId) {
                await this.onEnergyMeterChange(state);
                return;
            }
            // The state was changed
            if (state.ack) {
                return;
            }

            const boxExpressionMatch = id.match(/.box(\d+).(\w+)$/);
            if (boxExpressionMatch && boxExpressionMatch.length > 0) {
                const boxId = parseInt(boxExpressionMatch[1]) as BoxId;
                const parameter = boxExpressionMatch[2] as keyof Box;
                await this.onBoxStateChange(boxId, parameter, state);
                this.update();
                return;
            }

            const pvExpressionMatch = id.match(/.pv.(\w+)$/);
            if (pvExpressionMatch && pvExpressionMatch.length > 0) {
                const parameter = pvExpressionMatch[1] as keyof Pv;
                await this.onPvStateChange(parameter, state);
                this.update();
                return;
            }

        } else {
            // The state was deleted
            this.log.debug(`state ${id} deleted`);
            this.setTimeout(this.createStates.bind(this), 1000);
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            this.clearInterval(this.requestInterval);
            this.clearTimeout(this.updateTimeout);

            callback();
        } catch {
            callback();
        }
    }

    private async createConfigStates(): Promise<void> {
        const promises: Promise<any>[] = [];

        if (await this.objectExists(`cfg`)) {
            await this.delObjectAsync(`cfg`, {recursive: true});
        }
        await this.extendObject(`cfg`, {
            type: 'device',
        });
        for (const wbecConfigKey in this.wbecConfig) {
            const id = `cfg.${wbecConfigKey}`;
            const value = this.wbecConfig[wbecConfigKey as keyof typeof this.wbecConfig];
            promises.push(this.extendObject(id, {
                type: 'state',
                common: {
                    name: wbecConfigKey,
                    write: false,
                    type: (typeof value) as ioBroker.CommonType,
                },
            }).then(() => this.setState(id, value, true)));
        }

        return Promise.any(promises);
    }

    // Only Create states after this line:

    private async createStates(): Promise<any> {
        const initPromises: Promise<any>[] = [];
        initPromises.push(this.createWbecStates());
        for (let boxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
            initPromises.push(this.createBoxStates(boxId));
        }
        await Promise.all(initPromises);
    }
    private async createWbecStates(): Promise<any> {
        let idPrefix = '';
        idPrefix = 'wbec';
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.version`, {
            type: 'state',
            common: {
                name: 'version',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.bldDate`, {
            type: 'state',
            common: {
                name: 'bldDate',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.timeNow`, {
            type: 'state',
            common: {
                name: 'timeNow',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.enwg14a`, {
            type: 'state',
            common: {
                name: 'enwg14a',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.enwgErr`, {
            type: 'state',
            common: {
                name: 'enwgErr',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
        idPrefix = 'modbus';
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.state.lastTm`, {
            type: 'state',
            common: {
                name: 'lastTm',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.state.millis`, {
            type: 'state',
            common: {
                name: 'millis',
                role: 'value.interval',
                type: 'number',
                unit: 'ms',
                write: false,
            }
        })
        idPrefix = 'rfid';
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.enabled`, {
            type: 'state',
            common: {
                name: 'enabled',
                role: 'indicator',
                type: 'boolean',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.release`, {
            type: 'state',
            common: {
                name: 'release',
                role: 'indicator',
                type: 'boolean',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.lastId`, {
            type: 'state',
            common: {
                name: 'lastId',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        idPrefix = 'pv';
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.mode`, {
            type: 'state',
            common: {
                name: 'mode',
                role: 'inditator',
                type: 'number',
                states: {
                    0: 'Disabled',
                    1: 'Off',
                    2: 'Pv',
                    3: 'PvWithMin',
                },
                write: true,
            }
        })
        await this.extendObject(`${idPrefix}.watt`, {
            type: 'state',
            common: {
                name: 'watt',
                role: 'value.energy',
                type: 'number',
                unit: 'W',
                write: true,
            }
        })
        await this.extendObject(`${idPrefix}.wbId`, {
            type: 'state',
            common: {
                name: 'wbId',
                role: 'value',
                type: 'number',
                write: true,
            }
        })
        this.subscribeStates(`${idPrefix}.*`);
        idPrefix = 'wifi';
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.mac`, {
            type: 'state',
            common: {
                name: 'mac',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.rssi`, {
            type: 'state',
            common: {
                name: 'rssi',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.signal`, {
            type: 'state',
            common: {
                name: 'signal',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.channel`, {
            type: 'state',
            common: {
                name: 'channel',
                role: 'value',
                type: 'number',
                write: false,
            }
        })
    }
    private async createBoxStates(boxId: number): Promise<any> {
        const idPrefix = `box${boxId}`;
        await this.extendObject(idPrefix, {
            type: 'device'
        });
        await this.extendObject(`${idPrefix}.busId`, {
            type: 'state',
            common: {
                name: 'Bus Id',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.version`, {
            type: 'state',
            common: {
                name: 'version',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.chgStat`, {
            type: 'state',
            common: {
                name: 'chgStat',
                role: 'indicator',
                type: 'number',
                write: false,
            }
            /*
            switch (message.chgStat) {
                case  2: / carStat = 'nein'; wbStat = 'nein'; break;              // A1
                case  3: / carStat = 'nein'; wbStat = 'ja'; break;                // A2
                case  4: / carStat = 'ja, ohne Ladeanf.'; wbStat = 'nein'; break; // B1
                case  5: / carStat = 'ja, ohne Ladeanf.'; wbStat = 'ja'; break;   // B2
                case  6: / carStat = 'ja,  mit Ladeanf.'; wbStat = 'nein'; break; // C1
                case  7: / carStat = 'ja,  mit Ladeanf.'; wbStat = 'ja'; break;   // C2
                default: carStat = message.chgStat; wbStat = '-';
             */
        })
        await this.extendObject(`${idPrefix}.currL1`, {
            type: 'state',
            common: {
                name: 'Strom Phase 1',
                role: 'value.current',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.currL2`, {
            type: 'state',
            common: {
                name: 'Strom Phase 2',
                role: 'value.current',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.currL3`, {
            type: 'state',
            common: {
                name: 'Strom Phase 3',
                role: 'value.current',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.pcbTemp`, {
            type: 'state',
            common: {
                name: 'Controller Temperatur',
                role: 'value.temp',
                type: 'number',
                unit: '°C',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.voltL1`, {
            type: 'state',
            common: {
                name: 'Spannung Phase 1',
                role: 'value.voltage',
                type: 'number',
                unit: 'V',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.voltL2`, {
            type: 'state',
            common: {
                name: 'Spannung Phase 2',
                role: 'value.voltage',
                type: 'number',
                unit: 'V',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.voltL3`, {
            type: 'state',
            common: {
                name: 'Spannung Phase 3',
                role: 'value.voltage',
                type: 'number',
                unit: 'V',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.extLock`, {
            type: 'state',
            common: {
                name: 'extLock',
                role: 'state',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.power`, {
            type: 'state',
            common: {
                name: 'Power',
                type: 'number',
                write: false,
                role: 'value.power.consumed',
                unit: 'W',
            }
        })
        await this.extendObject(`${idPrefix}.energyP`, {
            type: 'state',
            common: {
                name: 'energyP',
                role: 'value.energy',
                type: 'number',
                unit: 'kWh',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.energyI`, {
            type: 'state',
            common: {
                name: 'Energiezähler',
                role: 'value.energy',
                type: 'number',
                unit: 'kWh',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.energyC`, {
            type: 'state',
            common: {
                name: 'Ladevorgang',
                role: 'value.energy',
                type: 'number',
                unit: 'kWh',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.currMax`, {
            type: 'state',
            common: {
                name: 'currMax',
                role: 'value.current',
                type: 'number',
                unit: 'A',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.currMin`, {
            type: 'state',
            common: {
                name: 'currMin',
                role: 'value.current',
                type: 'number',
                unit: 'A',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.logStr`, {
            type: 'state',
            common: {
                name: 'logStr',
                role: 'text',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.wdTmOut`, {
            type: 'state',
            common: {
                name: 'wdTmOut',
                role: 'value.interval',
                type: 'number',
                unit: 'ms',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.standby`, {
            type: 'state',
            common: {
                name: 'standby',
                role: 'state',
                type: 'number',
                desc: 'Reg. 258: Standby Function Control',
                states: {
                    0: 'enable standby',
                    4: 'disable standby'
                },
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.remLock`, {
            type: 'state',
            common: {
                name: 'remLock',
                role: 'state',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.currLim`, {
            type: 'state',
            common: {
                name: 'currLim',
                role: 'value.current',
                type: 'number',
                unit: 'A',
                write: true,
            }
        })
        await this.extendObject(`${idPrefix}.currFs`, {
            type: 'state',
            common: {
                name: 'currFs',
                role: 'value.current',
                type: 'number',
                unit: 'A',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.lmReq`, {
            type: 'state',
            common: {
                name: 'lmReq',
                role: 'state',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.lmLim`, {
            type: 'state',
            common: {
                name: 'lmLim',
                role: 'state',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.resCode`, {
            type: 'state',
            common: {
                name: 'resCode',
                role: 'state',
                type: 'string',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.failCnt`, {
            type: 'state',
            common: {
                name: 'failCnt',
                role: 'state',
                type: 'number',
                write: false,
            }
        })
        await this.extendObject(`${idPrefix}.phases`, {
            type: 'state',
            common: {
                name: 'Phasen',
                role: 'value',
                type: 'number',
                write: false,
            }
        })

        this.subscribeStates(`${idPrefix}.currLim`);
        this.subscribeStates(`${idPrefix}.chgStat`);
    }

}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Wbec(options);
} else {
    // otherwise start the instance directly
    (() => new Wbec())();
}
