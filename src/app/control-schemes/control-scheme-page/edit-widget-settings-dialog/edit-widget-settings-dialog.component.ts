import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { WidgetConfigModel } from '@app/store';

import { WidgetConnectionInfoL10nPipe } from '../widgets';
import { CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY, WidgetSettingsContainerComponent } from '../widget-settings-container';
import { ControlSchemeWidgetSettingsComponentFactoryService } from '../control-scheme-widget-settings-component-factory.service';

@Component({
    standalone: true,
    selector: 'app-edit-widget-settings-dialog',
    templateUrl: './edit-widget-settings-dialog.component.html',
    styleUrls: [ './edit-widget-settings-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        NgIf,
        TranslocoPipe,
        WidgetConnectionInfoL10nPipe,
        WidgetSettingsContainerComponent,
    ],
    providers: [
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY, useClass: ControlSchemeWidgetSettingsComponentFactoryService },
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
