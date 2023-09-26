import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputActivityIndicatorComponent, RangeControlComponent, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { GamepadSettingsAxisSettingsViewModel } from '../types';
import { InputOutputDiagramComponent } from '../input-output-diagram';
import { InputValuePercentHumanReadableValuePipe } from '../active-zone-human-readable-value.pipe';

@Component({
    standalone: true,
    selector: 'app-gamepad-settings-axis-settings',
    templateUrl: './gamepad-settings-axis-settings.component.html',
    styleUrls: [ './gamepad-settings-axis-settings.component.scss' ],
    imports: [
        InputValuePercentHumanReadableValuePipe,
        InputOutputDiagramComponent,
        MatDividerModule,
        PushPipe,
        RangeControlComponent,
        ToggleControlComponent,
        TranslocoModule,
        NgIf,
        MatInputModule,
        ReactiveFormsModule,
        SliderControlComponent,
        MatIconModule,
        MatTooltipModule,
        InputActivityIndicatorComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadSettingsAxisSettingsComponent {
    @Input() public axisSettingsViewModel?: GamepadSettingsAxisSettingsViewModel;
}