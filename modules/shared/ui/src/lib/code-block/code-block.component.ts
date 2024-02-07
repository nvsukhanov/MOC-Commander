import { Component, Inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { NAVIGATOR } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'lib-code-block[content]',
    template: `
            <code>{{ content !== undefined ? content : '' }}</code>
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
        MatIconButton,
        MatIcon,
        TranslocoPipe
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
        '.copy-button { padding: 0; width: 14px; height: 14px; margin-left: 5px; display: inline-flex }',
        '.copy-icon { font-size: 14px; width: 14px; height: 14px;}'
    ]
})
export class CodeBlockComponent {
    @Input() public content?: string;

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: Navigator
    ) {
    }

    public copyToClipboard(): void {
        if (this.content !== undefined) {
            this.navigator.clipboard.writeText(this.content);
        }
    }
}
