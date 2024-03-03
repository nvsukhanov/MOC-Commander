import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { EllipsisTitleDirective } from '../ellipsis-title.directive';
import { ConfirmationDialogModule, ConfirmationDialogService } from '../confirmation-dialog';

@Component({
    standalone: true,
    selector: 'lib-widget',
    templateUrl: './widget.component.html',
    styleUrls: [ './widget.component.scss' ],
    imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        PushPipe,
        NgTemplateOutlet,
        EllipsisTitleDirective,
        TranslocoPipe,
        ConfirmationDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {
    @Input() public title?: string;

    @Input() public subTitle?: string;

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly edit = new EventEmitter<void>();

    constructor(
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public onDelete(): void {
        this.confirmationService.confirm(
            this.translocoService.selectTranslate('widget.delete.title'),
            {
                content$: this.translocoService.selectTranslate('widget.delete.content'),
                confirmTitle$: this.translocoService.selectTranslate('widget.delete.confirmButtonTitle'),
                cancelTitle$: this.translocoService.selectTranslate('widget.delete.cancelButtonTitle')
            }
        ).subscribe((result) => {
            if (result) {
                this.delete.emit();
            }
        });
    }

    public onEdit(): void {
        this.edit.emit();
    }
}
