import { Observable } from 'rxjs';

import { ControllerSettings } from './controller-settings';

export interface IControllerProfile {
    readonly uid: string;

    readonly name$: Observable<string>;

    readonly buttonStateL10nKey: string;

    readonly axisStateL10nKey: string;

    readonly triggerButtonsIndices: ReadonlyArray<number>;

    getButtonName$(inputId: string): Observable<string>;

    getAxisName$(inputId: string): Observable<string>;

    getDefaultSettings(): ControllerSettings;
}
