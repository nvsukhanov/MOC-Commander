import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    styleUrl: './code-block.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeBlockComponent {
    @Input() public content?: string;
}
