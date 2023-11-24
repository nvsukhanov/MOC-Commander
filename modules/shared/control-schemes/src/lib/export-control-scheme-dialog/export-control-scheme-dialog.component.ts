import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS } from '@app/store';

import { ControlSchemeCompressorService } from './control-scheme-compressor.service';

export type ExportControlSchemeDialogData = {
    readonly name: string;
};

@Component({
    standalone: true,
    selector: 'lib-cs-export-control-scheme-dialog',
    templateUrl: './export-control-scheme-dialog.component.html',
    styleUrls: [ './export-control-scheme-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        TranslocoPipe,
        PushPipe
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
            map((scheme) => scheme ? this.compressor.compress(scheme) : '')
        );
    }

    public onCopy(): void {
        this.exportString$.pipe(
            take(1)
        ).subscribe((exportString) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.copyExportString({ exportString }));
        });
    }

    public onClose(): void {
        this.dialog.close();
    }
}
