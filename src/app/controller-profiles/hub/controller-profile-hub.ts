import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ButtonGroupButtonId } from '@nvsukhanov/rxpoweredup';

import { IControllerProfile } from '../i-controller-profile';

export const GREEN_BUTTON_INPUT_ID = 'green-button';

export class ControllerProfileHub implements IControllerProfile<null> {
    public readonly axisStateL10nKey: string = '';

    public readonly name$: Observable<string>;

    public readonly buttonStateL10nKey: string = 'controllerProfiles.buttonState';

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [];

    private _nameProvider: BehaviorSubject<Observable<string>> = new BehaviorSubject(of('unknown'));

    constructor(
        public readonly uid: string,
        public readonly hubId: string,
        private readonly translocoService: TranslocoService
    ) {
        this.name$ = this._nameProvider.pipe(
            switchMap((nameProvider) => nameProvider),
            switchMap((name) => {
                return translocoService.selectTranslate('controllerProfiles.hub.name', { name });
            })
        );
    }

    public setNameProvider(
        nameProvider: Observable<string>
    ): void {
        this._nameProvider.next(nameProvider);
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
