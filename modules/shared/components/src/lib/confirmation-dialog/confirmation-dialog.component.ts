import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';

export type ConfirmDialogData = {
    readonly title$?: Observable<string>;
    readonly content$?: Observable<string>;
    readonly confirmTitle$?: Observable<string>;
    readonly cancelTitle$?: Observable<string>;
};

@Component({
    standalone: true,
    selector: 'lib-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: [ './confirmation-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        AsyncPipe
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
