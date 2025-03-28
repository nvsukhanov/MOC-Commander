import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

import { COPY_TO_CLIPBOARD_HANDLER, ICopyToClipboardHandler } from './i-copy-to-clipboard-handler';

@Component({
    standalone: true,
    selector: 'lib-button-copy-to-clipboard',
    templateUrl: './button-copy-to-clipboard.component.html',
    imports: [
        MatIcon,
        MatIconButton,
        TranslocoPipe
    ],
    styles: `
        :host { display: flex; }
        .copy-button { padding: 0; width: 14px; height: 14px; margin-left: 5px; display: inline-flex }
        .copy-icon { font-size: 14px; width: 14px; height: 14px;}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
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
