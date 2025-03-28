import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';

import { LabelComponent } from '../label';

@Component({
    standalone: true,
    selector: 'lib-motor-position-adjustment-controls',
    templateUrl: './motor-position-adjustment-controls.component.html',
    styleUrl: './motor-position-adjustment-controls.component.scss',
    imports: [
        MatIcon,
        MatButton,
        TranslocoPipe,
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
