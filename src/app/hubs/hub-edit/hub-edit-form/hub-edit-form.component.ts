import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HubConfiguration } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MAX_NAME_SIZE } from '@nvsukhanov/poweredup-api';
import { TranslocoModule } from '@ngneat/transloco';
import { HUB_ROUTE } from '../../../routes';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export type HubEditFormSaveResult = {
    hubId: string;
    name: string;
};

@Component({
    standalone: true,
    selector: 'app-hub-edit-form',
    templateUrl: './hub-edit-form.component.html',
    styleUrls: [ './hub-edit-form.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        MatButtonModule,
        JsonPipe,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoModule,
        RouterLink,
        MatProgressBarModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubEditFormComponent {
    @Input() public isSaving: boolean | undefined;

    @Output() public readonly save = new EventEmitter<HubEditFormSaveResult>();

    public readonly form = this.formBuilder.group({
        hubId: this.formBuilder.control<string>('', { nonNullable: true }),
        name: this.formBuilder.control<string>('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(MAX_NAME_SIZE),
            Validators.pattern(/^[a-zA-Z0-9_.\s]+$/)
        ])
    });

    private _hubConfiguration?: HubConfiguration;

    private _viewPath: string[] = [];

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    @Input()
    public set hubConfiguration(v: HubConfiguration | undefined) {
        if (v) {
            if (this._hubConfiguration?.name !== v.name) {
                this.form.patchValue(v);
                this.form.controls.name.markAsPristine();
                this._viewPath = [ '', HUB_ROUTE, v.hubId ];
            }
        } else {
            this.form.reset();
            this._viewPath = [];
        }
        this._hubConfiguration = v;
    }

    public get hubConfiguration(): HubConfiguration | undefined {
        return this._hubConfiguration;
    }

    public get viewPath(): string[] {
        return this._viewPath;
    }

    public onSave(): void {
        if (this.form.valid) {
            this.save.emit({
                hubId: this.form.controls.hubId.value,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                name: this.form.controls.name.value!
            });
        }
    }
}
