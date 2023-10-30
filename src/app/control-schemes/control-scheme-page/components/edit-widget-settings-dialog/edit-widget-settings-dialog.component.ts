import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

import { ControlSchemeWidgetSettingsComponentResolverService, WidgetConnectionInfoL10nPipe } from '../widgets';
import { CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, WidgetSettingsContainerComponent } from '../widget-settings-container';
import { WidgetTypeToL10nKeyPipe } from '../../../common';

@Component({
    standalone: true,
    selector: 'app-edit-widget-settings-dialog',
    templateUrl: './edit-widget-settings-dialog.component.html',
    styleUrls: [ './edit-widget-settings-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        NgIf,
        PushPipe,
        TranslocoPipe,
        WidgetConnectionInfoL10nPipe,
        WidgetSettingsContainerComponent,
        WidgetTypeToL10nKeyPipe
    ],
    providers: [
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, useClass: ControlSchemeWidgetSettingsComponentResolverService },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWidgetSettingsDialogComponent {
    @ViewChild(WidgetSettingsContainerComponent, { static: false, read: WidgetSettingsContainerComponent })
    public readonly widgetSettingsContainer?: WidgetSettingsContainerComponent;

    private _canSave$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly dialog: MatDialogRef<EditWidgetSettingsDialogComponent, WidgetConfigModel>,
        @Inject(MAT_DIALOG_DATA) public readonly config: WidgetConfigModel
    ) {
    }

    public get canSave$(): Observable<boolean> {
        return this._canSave$;
    }

    public onCanSaveUpdate(
        canSave: boolean
    ): void {
        this._canSave$.next(canSave);
    }

    public onFormSubmit(
        config: WidgetConfigModel
    ): void {
        this.dialog.close(config);
    }

    public onSaveClick(): void {
        const config = this.widgetSettingsContainer?.getConfig();
        if (!config) {
            throw new Error('Widget settings are not valid');
        }
        this.dialog.close(config);
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
