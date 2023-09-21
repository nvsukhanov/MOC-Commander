import { Observable } from 'rxjs';

import { ControllerSettings } from './controller-settings';

export interface IControllerProfile<TSettings extends ControllerSettings | null | unknown> {
    readonly uid: string;

    readonly name$: Observable<string>;

    readonly buttonStateL10nKey: string;

    readonly axisStateL10nKey: string;

    readonly triggerButtonsIndices: ReadonlyArray<number>;

    getButtonName$(inputId: string | number): Observable<string>;

    getAxisName$(inputId: string): Observable<string>;

    getDefaultSettings(): TSettings;
}
