import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

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
        inputId: string
    ): Observable<string> {
        if (inputId === GREEN_BUTTON_INPUT_ID) {
            return this.translocoService.selectTranslate('controllerProfiles.hub.greenButton');
        }
        return of('');
    }

    public getDefaultSettings(): null {
        return null;
    }
}
