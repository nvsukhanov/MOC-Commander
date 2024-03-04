import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { InputActivityIndicatorComponent, RangeControlComponent, SliderControlComponent, ToggleControlComponent } from '@app/shared-ui';

import { GamepadSettingsButtonSettingsViewModel } from '../types';
import { InputOutputDiagramComponent } from '../input-output-diagram';
import { InputValuePercentHumanReadableValuePipe } from '../active-zone-human-readable-value.pipe';

@Component({
    standalone: true,
    selector: 'page-controller-view-gamepad-settings-button-settings',
    templateUrl: './gamepad-settings-button-settings.component.html',
    styleUrls: [ './gamepad-settings-button-settings.component.scss' ],
    imports: [
        InputValuePercentHumanReadableValuePipe,
        InputOutputDiagramComponent,
        MatDividerModule,
        RangeControlComponent,
        ToggleControlComponent,
        TranslocoPipe,
        SliderControlComponent,
        MatIconModule,
        InputActivityIndicatorComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadSettingsButtonSettingsComponent {
    @Input() public buttonSettingsViewModel?: GamepadSettingsButtonSettingsViewModel;
}
