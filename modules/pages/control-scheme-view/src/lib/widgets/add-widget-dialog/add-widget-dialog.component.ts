import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { WidgetConfigModel } from '@app/store';
import { WidgetTypeToL10nKeyPipe } from '@app/shared-control-schemes';

import { AddWidgetDialogViewModel } from './add-widget-dialog-view-model';
import { WidgetSettingsContainerComponent } from '../widget-settings-container';
import { WidgetConnectionInfoL10nPipe } from '../widget-connection-info-l10n.pipe';

@Component({
  standalone: true,
  selector: 'page-control-scheme-view-add-widget-dialog',
  templateUrl: './add-widget-dialog.component.html',
  styleUrl: './add-widget-dialog.component.scss',
  imports: [
    MatButtonModule,
    MatDialogModule,
    TranslocoPipe,
    ReactiveFormsModule,
    WidgetTypeToL10nKeyPipe,
    MatSelectModule,
    WidgetSettingsContainerComponent,
    WidgetConnectionInfoL10nPipe,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWidgetDialogComponent {
  public readonly addableWidgetConfigs: Array<WidgetConfigModel>;

  public readonly form = this.formBuilder.group({
    selectionIndex: this.formBuilder.control<number | null>(null, { validators: [Validators.required] }),
  });

  @ViewChild(WidgetSettingsContainerComponent, { static: false, read: WidgetSettingsContainerComponent })
  public readonly widgetSettingsContainer?: WidgetSettingsContainerComponent;

  private _config?: WidgetConfigModel;

  constructor(
    private readonly dialog: MatDialogRef<AddWidgetDialogComponent, WidgetConfigModel>,
    @Inject(MAT_DIALOG_DATA) private readonly dialogData: AddWidgetDialogViewModel,
    private readonly formBuilder: FormBuilder,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.addableWidgetConfigs = this.dialogData.addableWidgetConfigs;
  }

  public get config(): WidgetConfigModel | undefined {
    return this._config;
  }

  public get selectedWidgetBaseConfig(): WidgetConfigModel | undefined {
    const baseWidgetDataIndex = this.form.controls.selectionIndex.value;
    if (baseWidgetDataIndex === null) {
      return undefined;
    }
    return this.addableWidgetConfigs[baseWidgetDataIndex];
  }

  public onSave(event: Event): void {
    event.preventDefault();
    if (!this._config) {
      throw new Error('Widget settings are not valid');
    }
    this.dialog.close(this._config);
  }

  public onConfigChanges(config: WidgetConfigModel | undefined): void {
    this._config = config;
    this.cdRef.detectChanges(); // TODO: not sure why this is needed
  }

  public onCancel(): void {
    this.dialog.close();
  }
}
