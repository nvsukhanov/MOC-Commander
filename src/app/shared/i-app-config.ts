import { InjectionToken } from '@angular/core';

export interface IAppConfig {
    readonly gamepadReadInterval: number;
    readonly gamepadConnectionReadInterval: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRSSIPollInterval: number;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadReadInterval: 100,
        gamepadConnectionReadInterval: 100,
        hubBatteryPollInterval: 20000,
        hubRSSIPollInterval: 10000
    }),
    providedIn: 'root'
});
