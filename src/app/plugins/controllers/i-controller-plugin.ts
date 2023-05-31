import { Observable } from 'rxjs';
import { IControllerSettingsComponent } from './i-controller-settings-component';
import { ControllerSettings } from '../../store';
import { Type } from '@angular/core';

export interface IControllerPlugin<TSettings extends ControllerSettings = ControllerSettings> {
    readonly settingsComponent?: Type<IControllerSettingsComponent<TSettings>>;

    readonly nameL10nKey: string;

    readonly buttonStateL10nKey: string;

    readonly axisStateL10nKey: string;

    readonly triggerButtonIndices: ReadonlyArray<number>;

    getButtonName$(inputId: string): Observable<string>;

    getAxisName$(inputId: string): Observable<string>;
}
