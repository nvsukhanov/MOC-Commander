import { Observable } from 'rxjs';
import { Type } from '@angular/core';

import { IControllerSettingsComponent } from './i-controller-settings-component';
import { ControllerSettingsModel } from '../store';

export interface IControllerProfile<TSettings extends ControllerSettingsModel = ControllerSettingsModel> {
    readonly settingsComponent?: Type<IControllerSettingsComponent<TSettings>>;

    readonly nameL10nKey: string;

    readonly buttonStateL10nKey: string;

    readonly axisStateL10nKey: string;

    readonly triggerButtonIndices: ReadonlyArray<number>;

    getButtonName$(inputId: string): Observable<string>;

    getAxisName$(inputId: string): Observable<string>;
}
