import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { NEVER, Observable } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: [ './confirm-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        TranslocoModule,
        NgIf,
        PushPipe,
        LetDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
    @Output() public readonly confirm = new EventEmitter<void>();

    @Output() public readonly cancel = new EventEmitter<void>();

    @Input() public title$: Observable<string> = this.translocoService.selectTranslate('confirmationDialog.defaultTitle');

    @Input() public content$: Observable<string> = NEVER;

    @Input() public confirmTitle$ = this.translocoService.selectTranslate('confirmationDialog.defaultConfirmButtonTitle');

    @Input() public cancelTitle$ = this.translocoService.selectTranslate('confirmationDialog.defaultCancelButtonTitle');
    
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public onConfirm(): void {
        this.confirm.next();
    }

    public onCancel(): void {
        this.cancel.next();
    }
}
