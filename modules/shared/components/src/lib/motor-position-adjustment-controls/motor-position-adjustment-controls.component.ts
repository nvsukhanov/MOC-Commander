import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatLabel } from '@angular/material/form-field';
import { MOTOR_LIMITS } from 'rxpoweredup';

import { LabelComponent } from '../label';

@Component({
    standalone: true,
    selector: 'lib-motor-position-adjustment-controls',
    templateUrl: './motor-position-adjustment-controls.component.html',
    styleUrls: [ './motor-position-adjustment-controls.component.scss' ],
    imports: [
        MatIconButton,
        MatIcon,
        MatMiniFabButton,
        MatButton,
        TranslocoPipe,
        MatLabel,
        LabelComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorPositionAdjustmentControlsComponent {
    @Input() public canExecuteStep = false;

    @Input() public canGoToZero = false;

    @Input() public smallStepDegrees = MOTOR_LIMITS.minServoDegreesRange;

    @Input() public largeStepDegrees = 90;

    @Output() public readonly executeStep = new EventEmitter<number>();

    @Output() public readonly goToZero = new EventEmitter<void>();

    public onExecuteStep(
        stepDegrees: number
    ): void {
        this.executeStep.emit(stepDegrees);
    }

    public onGoToZero(): void {
        this.goToZero.emit();
    }
}
