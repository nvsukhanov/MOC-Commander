import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-hint',
  template: '<p class="hint"><ng-content></ng-content></p>',
  styles: '.hint { font-weight: 300; padding: 20px 30px; margin: 0; font-size: 18px; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent {}
