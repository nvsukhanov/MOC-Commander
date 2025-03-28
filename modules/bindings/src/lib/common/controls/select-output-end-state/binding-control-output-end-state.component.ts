import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MotorServoEndState } from 'rxpoweredup';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { MotorServoEndStateL10nKeyPipe } from '@app/shared-components';

@Component({
  standalone: true,
  selector: 'lib-cs-binding-control-output-end-state',
  templateUrl: './binding-control-output-end-state.component.html',
  styleUrl: './binding-control-output-end-state.component.scss',
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, MotorServoEndStateL10nKeyPipe, TranslocoPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingControlOutputEndStateComponent {
  @Input() public control?: FormControl<MotorServoEndState>;

  @Input() public translocoTitle = '';

  public readonly motorServoEndStates: ReadonlyArray<MotorServoEndState> = [MotorServoEndState.float, MotorServoEndState.hold, MotorServoEndState.brake];
}
