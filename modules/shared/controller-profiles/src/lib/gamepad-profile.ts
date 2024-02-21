import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Memoize } from 'typescript-memoize';

import { createScopedControllerL10nKeyBuilder } from './create-controller-l10n-key';
import { IControllerProfile } from './i-controller-profile';
import { GamepadSettings } from './controller-settings';
import { ControllerType } from './controller-type';
import { IControllersConfig } from './i-controllers-config';

export abstract class GamepadProfile implements IControllerProfile<GamepadSettings> {
    public abstract readonly uid: string;

    public abstract name$: Observable<string>;

    public abstract readonly buttonStateL10nKey: string;

    public abstract readonly axisStateL10nKey: string;

    public abstract readonly triggerButtonsIndices: ReadonlyArray<number>;

    protected abstract axisNames: { readonly [k in string]: Observable<string> };

    protected abstract buttonNames: { readonly [k in string]: Observable<string> };

    protected abstract invertedAxisIndices: ReadonlyArray<number>;

    private readonly l10nScopeKeyBuilder: (key: string) => string;

    private readonly genericGamepadL10nScopeKeyBuilder: (key: string) => string;

    protected constructor(
        protected readonly translocoService: TranslocoService,
        protected readonly l10nScopeName: string,
        protected readonly config: IControllersConfig
    ) {
        this.l10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder(l10nScopeName);
        this.genericGamepadL10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder('steamDeck');
    }

    public abstract controllerIdMatch(id: string): boolean;

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.axisNames[inputId]
            ?? this.translocoService.selectTranslate(this.genericGamepadL10nScopeKeyBuilder('axis'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.buttonNames[inputId]
            ?? this.translocoService.selectTranslate(this.genericGamepadL10nScopeKeyBuilder('button'), { inputId });
    }

    public getDefaultSettings(): GamepadSettings {
        const result: GamepadSettings = {
            controllerType: ControllerType.Gamepad,
            axisConfigs: {},
            buttonConfigs: {}
        };
        Object.keys(this.axisNames).forEach((axisId) => {
            result.axisConfigs[axisId] = {
                activeZoneStart: this.config.gamepad.defaultAxisActiveZoneStart,
                activeZoneEnd: this.config.maxInputValue,
                invert: this.invertedAxisIndices.includes(Number(axisId)),
                ignoreInput: false,
                trim: 0,
                activationThreshold: this.config.gamepad.defaultActivationThreshold,
            };
        });
        Object.keys(this.buttonNames).forEach((buttonId) => {
            result.buttonConfigs[buttonId] = {
                activeZoneStart: this.config.gamepad.defaultButtonActiveZoneStart,
                activeZoneEnd: this.config.maxInputValue,
                ignoreInput: false,
                trim: 0,
                activationThreshold: this.config.gamepad.defaultActivationThreshold,
                invert: false
            };
        });
        return result;
    }

    protected getTranslation(
        key: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder(key));
    }
}
