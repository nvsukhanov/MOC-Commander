import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { COMMON_ACTIONS, CONTROL_SCHEME_SELECTORS } from '@app/store';

import { ControlSchemeCompressorService } from './control-scheme-compressor.service';

export type ExportControlSchemeDialogData = {
    readonly name: string;
};

@Component({
    standalone: true,
    selector: 'lib-cs-export-control-scheme-dialog',
    templateUrl: './export-control-scheme-dialog.component.html',
    styleUrl: './export-control-scheme-dialog.component.scss',
    imports: [
        MatButtonModule,
        MatDialogModule,
        TranslocoPipe,
        AsyncPipe
    ],
    providers: [
        ControlSchemeCompressorService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportControlSchemeDialogComponent {
    public readonly exportString$: Observable<string>;

    constructor(
        private readonly dialog: MatDialogRef<ExportControlSchemeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly data: ExportControlSchemeDialogData,
        private readonly compressor: ControlSchemeCompressorService,
        private readonly store: Store
    ) {
        this.exportString$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(this.data.name)).pipe(
            map((scheme) => (scheme ? this.compressor.compress(scheme) : ''))
        );
    }

    public onCopy(): void {
        this.exportString$.pipe(
            take(1)
        ).subscribe((exportString) => {
            this.store.dispatch(COMMON_ACTIONS.copyToClipboard({ content: exportString }));
        });
    }

    public onClose(): void {
        this.dialog.close();
    }
}
