import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { ControllerType, IAppConfig } from '@app/shared';

import { IControllerProfile } from './i-controller-profile';
import { createControllerL10nKey, createScopedControllerL10nKeyBuilder } from './create-controller-l10n-key';
import { GamepadAxisSettings, GamepadSettings } from './controller-settings';

export class ControllerProfileGenericGamepad implements IControllerProfile {

    public readonly uid: string;

    public readonly nameL10nKey: string;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices = [];

    private readonly l10nScopeKeyBuilder: (key: string) => string;

    constructor(
        uid: string,
        private readonly axesCount: number,
        private readonly translocoService: TranslocoService,
        private readonly appConfig: IAppConfig
    ) {
        this.uid = uid;
        this.l10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder('genericGamepad');
        this.nameL10nKey = this.l10nScopeKeyBuilder('name');
    }

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder('axis'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder('button'), { inputId });
    }

    public getDefaultSettings(): GamepadSettings {
        const axisConfigs: { [k in string]: GamepadAxisSettings } = {};
        for (let i = 0; i < this.axesCount; i++) {
            axisConfigs[i] = {
                activeZoneStart: this.appConfig.gamepadAxisDefaultDeadZone,
                activeZoneEnd: 1,
                invert: false,
            };
        }
        return {
            controllerType: ControllerType.Gamepad,
            axisConfigs,
        };
    }
}
