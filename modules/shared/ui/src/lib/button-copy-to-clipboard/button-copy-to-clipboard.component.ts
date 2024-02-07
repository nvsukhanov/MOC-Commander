import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@ngneat/transloco';
import { COMMON_ACTIONS } from '@app/store';

@Component({
    standalone: true,
    selector: 'lib-button-copy-to-clipboard',
    template: `
        <button mat-icon-button
                class="copy-button"
                (click)="copyToClipboard()"
                title="{{ 'common.copyToClipboard' | transloco }}"
        >
            <mat-icon [fontIcon]="'content_copy'"
                      class="copy-icon"
            ></mat-icon>
            <span class="cdk-visually-hidden">{{ 'common.copyToClipboard' | transloco }}</span>
        </button>
    `,
    imports: [
        MatIcon,
        MatIconButton,
        TranslocoPipe
    ],
    styles: [
        ':host { display: flex; }',
        '.copy-button { padding: 0; width: 14px; height: 14px; margin-left: 5px; display: inline-flex }',
        '.copy-icon { font-size: 14px; width: 14px; height: 14px;}'
    ]
})
export class ButtonCopyToClipboardComponent {
    @Input() public content?: string;

    constructor(
        private store: Store,
    ) {
    }

    public copyToClipboard(): void {
        if (this.content !== undefined) {
            this.store.dispatch(COMMON_ACTIONS.copyToClipboard({ content: this.content }));
        }
    }
}
