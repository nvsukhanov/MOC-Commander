import { Directive, TemplateRef } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appTiltGaugeIcon]'
})
export class TiltGaugeIconDirective {
    constructor(
        public readonly templateRef: TemplateRef<unknown>,
    ) {
    }
}
