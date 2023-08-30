import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-hint',
    imports: [
        TranslocoModule
    ],
    template: '<p class="hint"><ng-content></ng-content></p>',
    styles: [
        '.hint { font-weight: 300; padding: 20px 30px; margin: 0; font-size: 18px; }'
    ]
})
export class HintComponent {
}
