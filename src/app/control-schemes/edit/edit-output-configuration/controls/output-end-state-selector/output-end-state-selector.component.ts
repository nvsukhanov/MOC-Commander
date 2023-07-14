import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { MotorServoEndStateL10nKeyPipe } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-output-end-state-selector[control][translocoTitle]',
    templateUrl: './output-end-state-selector.component.html',
    styleUrls: [ './output-end-state-selector.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MotorServoEndStateL10nKeyPipe,
        NgForOf,
        TranslocoModule,
        NgIf,
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputEndStateSelectorComponent {
    @Input() public control?: FormControl<MotorServoEndState>;

    @Input() public translocoTitle = '';

    public readonly motorServoEndStates: ReadonlyArray<MotorServoEndState> = [
        MotorServoEndState.float,
        MotorServoEndState.hold,
        MotorServoEndState.brake
    ];
}