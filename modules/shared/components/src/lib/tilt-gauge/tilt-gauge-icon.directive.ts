import { Directive, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[libTiltGaugeIcon]',
})
export class TiltGaugeIconDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
