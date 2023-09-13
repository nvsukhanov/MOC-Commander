import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MotorServoEndStateL10nKeyPipe, getEnumValues } from '@app/shared';
import { InputGain } from '@app/store';

import { InputGainL10nKeyPipe } from './input-gain-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-binding-control-select-input-gain',
    templateUrl: './binding-control-select-input-gain.component.html',
    styleUrls: [ './binding-control-select-input-gain.component.scss' ],
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
export class BindingControlSelectInputGainComponent {
    @Input() public control?: FormControl<InputGain>;

    @Input() public translocoTitle = 'controlScheme.inputGain';

    protected readonly gainOptions: ReadonlyArray<InputGain> = getEnumValues(InputGain);
}
