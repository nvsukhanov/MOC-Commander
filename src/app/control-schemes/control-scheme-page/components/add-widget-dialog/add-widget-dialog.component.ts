import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { WidgetConfigModel, WidgetType } from '@app/store';

import { AddWidgetDialogViewModel } from './add-widget-dialog-view-model';
import { WidgetTypeToL10nKeyPipe } from '../../../common';
import { CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, WidgetSettingsContainerComponent } from '../widget-settings-container';
import { ControlSchemeWidgetSettingsComponentResolverService, WidgetConnectionInfoL10nPipe } from '../widgets';

@Component({
    standalone: true,
    selector: 'app-add-widget-dialog',
    templateUrl: './add-widget-dialog.component.html',
    styleUrls: [ './add-widget-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        PushPipe,
        TranslocoPipe,
        ReactiveFormsModule,
        NgForOf,
        WidgetTypeToL10nKeyPipe,
        MatSelectModule,
        WidgetSettingsContainerComponent,
        NgIf,
        WidgetConnectionInfoL10nPipe,
        JsonPipe,
        LetDirective,
    ],
    providers: [
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, useClass: ControlSchemeWidgetSettingsComponentResolverService },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWidgetDialogComponent {
    public readonly widgetSelectionData: Array<WidgetConfigModel>;

    public readonly form = this.formBuilder.group({
        widgetType: this.formBuilder.control<WidgetType | null>(null, { validators: [ Validators.required ] })
    });

    public readonly selectedBaseConfig$: Observable<WidgetConfigModel | undefined>;

    public readonly canSave$: Observable<boolean>;

    @ViewChild(WidgetSettingsContainerComponent, { static: false, read: WidgetSettingsContainerComponent })
    public readonly widgetSettingsContainer?: WidgetSettingsContainerComponent;

    private readonly _canSave$: BehaviorSubject<boolean>;

    private _config?: WidgetConfigModel;

    constructor(
        private readonly dialog: MatDialogRef<AddWidgetDialogComponent, WidgetConfigModel>,
        @Inject(MAT_DIALOG_DATA) private readonly dialogData: AddWidgetDialogViewModel,
        private readonly formBuilder: FormBuilder,
        private readonly cdRef: ChangeDetectorRef
    ) {
        this.widgetSelectionData = this.dialogData.widgets;
        this._canSave$ = new BehaviorSubject<boolean>(false);
        this.canSave$ = this._canSave$;

        this.selectedBaseConfig$ = this.form.controls.widgetType.valueChanges.pipe(
            startWith(null),
            map(() => this.form.controls.widgetType.value),
            map((widgetType) => {
                if (widgetType === null) {
                    return undefined;
                }
                return this.widgetSelectionData.find((widgetSelectionData) => widgetSelectionData.widgetType === widgetType);
            })
        );
    }

    public onCanSaveChanges(
        canSave: boolean
    ): void {
        this._canSave$.next(canSave);
        this.cdRef.detectChanges(); // TODO: not sure why this is needed
    }

    public onSave(
        event: Event
    ): void {
        event.preventDefault();
        if (!this._config) {
            throw new Error('Widget settings are not valid');
        }
        this.dialog.close(this._config);
    }

    public onConfigChanges(
        config: WidgetConfigModel
    ): void {
        this._config = config;
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
