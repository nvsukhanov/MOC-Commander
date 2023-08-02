import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-hint',
    imports: [
        TranslocoModule
    ],
    template: '<p class="hint">{{ hintL10nKey | transloco }}</p>',
    styles: [
        '.hint { font-weight: 300; padding: 20px 30px; margin: 0; font-size: 18px; }'
    ]
})
export class HintComponent {
    @Input() public hintL10nKey = '';
}
