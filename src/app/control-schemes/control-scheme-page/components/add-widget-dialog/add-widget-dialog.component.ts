import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable, map, startWith, switchMap } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

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
    ],
    providers: [
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, useClass: ControlSchemeWidgetSettingsComponentResolverService },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWidgetDialogComponent {
    public readonly widgetSelectionData: Array<Omit<WidgetConfigModel, 'id' | 'name'>>;

    public readonly form = this.formBuilder.group({
        selectionData: this.formBuilder.control<Omit<WidgetConfigModel, 'id' | 'name'> | null>(null, {
            validators: [ Validators.required ]
        })
    });

    public readonly canSave$: Observable<boolean>;

    @ViewChild(WidgetSettingsContainerComponent, { static: false, read: WidgetSettingsContainerComponent })
    public readonly widgetSettingsContainer?: WidgetSettingsContainerComponent;

    private readonly _widgetSettingsCanBeSaved: BehaviorSubject<boolean>;

    constructor(
        private readonly dialog: MatDialogRef<AddWidgetDialogComponent, Omit<WidgetConfigModel, 'id' | 'name'>>,
        @Inject(MAT_DIALOG_DATA) private readonly dialogData: AddWidgetDialogViewModel,
        private readonly formBuilder: FormBuilder,
        private readonly cdRef: ChangeDetectorRef
    ) {
        this.widgetSelectionData = this.dialogData.widgets;
        this._widgetSettingsCanBeSaved = new BehaviorSubject<boolean>(false);
        this.canSave$ = this.form.valueChanges.pipe(
            startWith(null),
            switchMap(() => this._widgetSettingsCanBeSaved),
            map((widgetSettingsCanBeSaved) => {
                return this.form.valid && widgetSettingsCanBeSaved;
            })
        );
    }

    public onWidgetSettingsCanBeSavedUpdate(
        canSave: boolean
    ): void {
        this._widgetSettingsCanBeSaved.next(canSave);
        this.cdRef.detectChanges(); // TODO: not sure why this is needed
    }

    public onSave(): void {
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
