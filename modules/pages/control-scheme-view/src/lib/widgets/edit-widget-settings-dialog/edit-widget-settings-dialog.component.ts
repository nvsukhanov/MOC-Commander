import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { WidgetConfigModel } from '@app/store';

import { WidgetConnectionInfoL10nPipe } from '../widget-connection-info-l10n.pipe';
import { WidgetSettingsContainerComponent } from '../widget-settings-container';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-edit-widget-settings-dialog',
    templateUrl: './edit-widget-settings-dialog.component.html',
    styleUrls: [ './edit-widget-settings-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        TranslocoPipe,
        WidgetConnectionInfoL10nPipe,
        WidgetSettingsContainerComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWidgetSettingsDialogComponent {
    private _config?: WidgetConfigModel;

    constructor(
        private readonly dialog: MatDialogRef<EditWidgetSettingsDialogComponent, WidgetConfigModel>,
        @Inject(MAT_DIALOG_DATA) public readonly initialConfig: WidgetConfigModel,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        this._config = { ...initialConfig };
    }

    public get config(): WidgetConfigModel | undefined {
        return this._config;
    }

    public onConfigChanges(
        config: WidgetConfigModel | undefined
    ): void {
        this._config = config;
        this.changeDetectorRef.detectChanges();
    }

    public onFormSubmit(
        event: Event
    ): void {
        event.preventDefault();
        if (this._config) {
            this.dialog.close(this._config);
        }
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
