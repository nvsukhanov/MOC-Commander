import { Component, Inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

import { COPY_TO_CLIPBOARD_HANDLER, ICopyToClipboardHandler } from './i-copy-to-clipboard-handler';

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
        @Inject(COPY_TO_CLIPBOARD_HANDLER) private readonly copyToClipboardHandler: ICopyToClipboardHandler,
    ) {
    }

    public copyToClipboard(): void {
        if (this.content !== undefined) {
            this.copyToClipboardHandler.copy(this.content);
        }
    }
}
