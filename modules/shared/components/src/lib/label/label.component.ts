import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-cs-label',
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {}
