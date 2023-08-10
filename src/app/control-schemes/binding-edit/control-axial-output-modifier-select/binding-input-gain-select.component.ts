import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MotorServoEndStateL10nKeyPipe } from '@app/shared';
import { InputGain } from '@app/store';

import { InputGainL10nKeyPipe } from '../output-gain-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-binding-input-gain-select',
    templateUrl: './binding-input-gain-select.component.html',
    styleUrls: [ './binding-input-gain-select.component.scss' ],
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MotorServoEndStateL10nKeyPipe,
        NgForOf,
        NgIf,
        TranslocoModule,
        ReactiveFormsModule,
        InputGainL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingInputGainSelectComponent {
    @Input() public control?: FormControl<InputGain>;

    protected readonly translocoTitle = 'controlScheme.inputGain';

    protected readonly gainOptions: ReadonlyArray<InputGain> = [
        InputGain.None,
        InputGain.Logarithmic,
        InputGain.Exponential
    ];
}
