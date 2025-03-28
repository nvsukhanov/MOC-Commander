import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'page-settings-reset-state-dialog',
  templateUrl: './reset-state-dialog.component.html',
  styleUrl: './reset-state-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, TranslocoPipe],
})
export class ResetStateDialogComponent {
  constructor(private readonly dialog: MatDialogRef<ResetStateDialogComponent>) {}

  public onReset(): void {
    this.dialog.close(true);
  }

  public onCancel(): void {
    this.dialog.close(false);
  }
}
