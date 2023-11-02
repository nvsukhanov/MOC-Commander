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
import { ReactiveFormsModule } from '@angular/forms';
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
        WidgetTypeToL10nKeyPipe,
        ReactiveFormsModule
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

    private _config?: WidgetConfigModel;

    constructor(
        private readonly dialog: MatDialogRef<EditWidgetSettingsDialogComponent, WidgetConfigModel>,
        @Inject(MAT_DIALOG_DATA) public readonly config: WidgetConfigModel
    ) {
        this._config = { ...config };
    }

    public get canSave$(): Observable<boolean> {
        return this._canSave$;
    }

    public onConfigChanges(
        config: WidgetConfigModel
    ): void {
        this._config = config;
    }

    public onCanSaveChanges(
        canSave: boolean
    ): void {
        this._canSave$.next(canSave);
    }

    public onFormSubmit(
        event: Event
    ): void {
        event.preventDefault();
        this.dialog.close(this._config);
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
