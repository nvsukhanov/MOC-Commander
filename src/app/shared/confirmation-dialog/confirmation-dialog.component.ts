import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export type ConfirmDialogData = {
    readonly title$?: Observable<string>;
    readonly content$?: Observable<string>;
    readonly confirmTitle$?: Observable<string>;
    readonly cancelTitle$?: Observable<string>;
};

@Component({
    standalone: true,
    selector: 'app-confirm-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: [ './confirmation-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        TranslocoModule,
        NgIf,
        PushPipe,
        LetDirective,
        MatDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
    private readonly defaultTitle$ = this.translocoService.selectTranslate('confirmationDialog.defaultTitle');

    private readonly defaultContent$ = of('');

    private readonly defaultConfirmTitle$ = this.translocoService.selectTranslate('confirmationDialog.defaultConfirmButtonTitle');

    private readonly defaultCancelTitle$ = this.translocoService.selectTranslate('confirmationDialog.defaultCancelButtonTitle');

    constructor(
        @Inject(MAT_DIALOG_DATA) private readonly data: ConfirmDialogData,
        private readonly translocoService: TranslocoService,
        private readonly dialog: MatDialogRef<ConfirmationDialogComponent>,
    ) {
    }

    public get title$(): Observable<string> {
        return this.data.title$ ?? this.defaultTitle$;
    }

    public get content$(): Observable<string> {
        return this.data.content$ ?? this.defaultContent$;
    }

    public get confirmTitle$(): Observable<string> {
        return this.data.confirmTitle$ ?? this.defaultConfirmTitle$;
    }

    public get cancelTitle$(): Observable<string> {
        return this.data.cancelTitle$ ?? this.defaultCancelTitle$;
    }

    public onConfirm(): void {
        this.dialog.close(true);
    }

    public onCancel(): void {
        this.dialog.close(false);
    }
}
