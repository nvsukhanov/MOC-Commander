import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, startWith, take } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessagesDirective, WidgetType } from '@app/shared-misc';
import { TemperatureWidgetConfigModel } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

@Component({
  standalone: true,
  selector: 'lib-temperature-sensor-widget-settings',
  templateUrl: './temperature-sensor-widget-settings.component.html',
  styleUrl: './temperature-sensor-widget-settings.component.scss',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoPipe, ValidationMessagesDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemperatureSensorWidgetSettingsComponent implements OnDestroy {
  @Output() public readonly configChanges = new EventEmitter<TemperatureWidgetConfigModel | undefined>();

  public readonly form = this.formBuilder.group({
    id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
    title: this.formBuilder.control<string>('', { validators: [Validators.required], nonNullable: true }),
    hubId: this.commonFormBuilder.hubIdControl(),
    portId: this.commonFormBuilder.portIdControl(),
    modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
    valueChangeThreshold: this.formBuilder.control<number>(5, {
      validators: [Validators.required, Validators.min(0.1), Validators.max(10)],
      nonNullable: true,
    }),
    width: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
    height: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
  });

  private configChangesSubscription?: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly commonFormBuilder: ControlSchemeFormBuilderService,
    private readonly translocoService: TranslocoService,
  ) {}

  @Input()
  public set config(config: TemperatureWidgetConfigModel | undefined) {
    this.configChangesSubscription?.unsubscribe();
    if (config) {
      this.form.patchValue(config);
    } else {
      this.form.reset();
    }
    if (!this.form.controls.title.valid) {
      this.translocoService
        .selectTranslate('controlScheme.widgets.temperature.defaultName')
        .pipe(take(1))
        .subscribe((name) => {
          this.form.controls.title.setValue(name, { emitEvent: true });
        });
    }
    this.configChangesSubscription = this.form.valueChanges.pipe(startWith(null)).subscribe(() => {
      this.configChanges.emit(this.config);
    });
  }

  public get config(): TemperatureWidgetConfigModel | undefined {
    if (
      this.form.controls.hubId.value === null ||
      this.form.controls.portId.value === null ||
      this.form.controls.modeId.value === null ||
      this.form.invalid
    ) {
      return undefined;
    }
    return {
      widgetType: WidgetType.Temperature,
      id: this.form.controls.id.value,
      title: this.form.controls.title.value,
      hubId: this.form.controls.hubId.value,
      portId: this.form.controls.portId.value,
      modeId: this.form.controls.modeId.value,
      valueChangeThreshold: +this.form.controls.valueChangeThreshold.value,
      width: this.form.controls.width.value,
      height: this.form.controls.height.value,
    };
  }

  public ngOnDestroy(): void {
    this.configChangesSubscription?.unsubscribe();
  }
}
