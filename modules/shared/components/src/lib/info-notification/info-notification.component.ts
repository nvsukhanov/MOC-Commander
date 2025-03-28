import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-info-notification',
  templateUrl: './info-notification.component.html',
  styleUrl: './info-notification.component.scss',
  imports: [MatSnackBarLabel, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoNotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public readonly caption$: Observable<string>) {}
}
