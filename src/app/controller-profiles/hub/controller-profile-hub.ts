import { Observable, of } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ButtonGroupButtonId } from '@nvsukhanov/rxpoweredup';

import { IControllerProfile } from '../i-controller-profile';

export const GREEN_BUTTON_INPUT_ID = 'green-button';

export class ControllerProfileHub implements IControllerProfile<null> {
    public readonly axisStateL10nKey: string = '';

    public readonly buttonStateL10nKey: string = 'controllerProfiles.buttonState';

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [];

    private _name$: Observable<string> = of('');

    constructor(
        public readonly uid: string,
        public readonly hubId: string,
        private readonly translocoService: TranslocoService
    ) {
    }

    public get name$(): Observable<string> {
        return this._name$;
    }

    public setName(
        nameProvider: Observable<string>
    ): void {
        this._name$ = nameProvider;
    }

    public getAxisName$(): Observable<string> {
        return of('');
    }

    public getButtonName$(
        inputId: string | number
    ): Observable<string> {
        switch (inputId) {
            case GREEN_BUTTON_INPUT_ID:
                return this.translocoService.selectTranslate('controllerProfiles.hub.greenButton');
            case ButtonGroupButtonId.Red:
                return this.translocoService.selectTranslate('controllerProfiles.hub.redButton');
            case ButtonGroupButtonId.Plus:
                return this.translocoService.selectTranslate('controllerProfiles.hub.plusButton');
            case ButtonGroupButtonId.Minus:
                return this.translocoService.selectTranslate('controllerProfiles.hub.minusButton');
            default:
                return this.translocoService.selectTranslate('controllerProfiles.hub.genericButton', { inputId });
        }
    }

    public getDefaultSettings(): null {
        return null;
    }
}
