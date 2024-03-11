import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, startWith, take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessagesDirective, WidgetType } from '@app/shared-misc';
import { ToggleControlComponent } from '@app/shared-ui';

import { UnifiedTiltWidgetConfig } from '../unified-tilt-widget-config';
import { CommonTiltWidgetsFormBuilderService } from '../common-tilt-widgets-form-builder.service';

@Component({
    standalone: true,
    selector: 'lib-pitch-sensor-widget-settings',
    templateUrl: './common-tilt-widget-settings.component.html',
    styleUrls: [ './common-tilt-widget-settings.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoPipe,
        ValidationMessagesDirective,
        ToggleControlComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonTiltWidgetSettingsComponent implements OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<UnifiedTiltWidgetConfig | undefined>();

    @Input() public defaultNameL10nKey = '';

    @Input() public widgetType: WidgetType.Yaw | WidgetType.Pitch | null = null;

    public readonly form = this.formBuilder.buildPitchWidgetForm();

    private configChangesSubscription?: Subscription;

    constructor(
        private readonly formBuilder: CommonTiltWidgetsFormBuilderService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    @Input()
    public set config(
        config: UnifiedTiltWidgetConfig | undefined
    ) {
        this.configChangesSubscription?.unsubscribe();
        if (config) {
            this.form.patchValue(config);
            this.form.updateValueAndValidity();
        } else {
            this.form.reset();
        }
        if (!this.form.controls.title.valid) {
            this.translocoService.selectTranslate(this.defaultNameL10nKey).pipe(
                take(1)
            ).subscribe((name) => {
                this.form.controls.title.setValue(name);
                this.form.markAsDirty();
                this.form.updateValueAndValidity();
            });
        }
        this.configChangesSubscription = this.form.valueChanges.pipe(
            startWith(null)
        ).subscribe(() => {
            this.configChanges.emit(this.config);
        });
    }

    public get config(): UnifiedTiltWidgetConfig | undefined {
        if (this.widgetType !== null) {
            return this.formBuilder.mapFormToTiltWidgetConfig(this.widgetType, this.form);
        }
        return undefined;
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }
}
