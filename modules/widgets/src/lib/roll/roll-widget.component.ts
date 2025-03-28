import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TiltGaugeComponent, WidgetComponent } from '@app/shared-components';

@Component({
  standalone: true,
  selector: 'lib-roll-sensor-widget',
  templateUrl: './roll-widget.component.html',
  styleUrl: '../common/common-tilt-widgets-styles.scss',
  imports: [WidgetComponent, MatButtonModule, TiltGaugeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollWidgetComponent {
  @Input() public roll: number | null = null;

  @Input() public title = '';

  @Input() public canBeDeleted = false;

  @Input() public canBeEdited = false;

  @Output() public readonly edit = new EventEmitter<void>();

  @Output() public readonly delete = new EventEmitter<void>();

  @Output() public readonly compensate = new EventEmitter<number>();

  @Output() public readonly resetCompensation = new EventEmitter<void>();

  private isCompensating = false;

  public toggleCompensation(): void {
    if (this.isCompensating) {
      this.resetCompensation.emit();
      this.isCompensating = false;
    } else if (this.roll !== null) {
      this.compensate.emit(this.roll);
      this.isCompensating = true;
    }
  }

  public onEdit(): void {
    this.edit.emit();
  }

  public onDelete(): void {
    this.delete.emit();
  }
}
