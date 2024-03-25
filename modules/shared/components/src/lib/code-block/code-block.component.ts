import { Component, Input } from '@angular/core';

import { ButtonCopyToClipboardComponent } from '../button-copy-to-clipboard';

@Component({
    standalone: true,
    selector: 'lib-code-block[content]',
    template: `
            <code>{{ content !== undefined ? content : '' }}</code>
            <lib-button-copy-to-clipboard [content]="content"></lib-button-copy-to-clipboard>
    `,
    imports: [
        ButtonCopyToClipboardComponent
    ],
    styles: [
        `:host {
            display: inline-flex;
            align-items: center;
            padding: 0 5px;
            background-color: var(--app-background-color);
            border-radius: 3px;
            flex-wrap: wrap;
        }`,
        'code { padding: 2px 5px; }',
    ]
})
export class CodeBlockComponent {
    @Input() public content?: string;
}
