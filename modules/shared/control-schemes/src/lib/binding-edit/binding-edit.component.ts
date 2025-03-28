import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, distinctUntilChanged, map, merge, startWith } from 'rxjs';
import { AppValidators, ControlSchemeBindingType, EnsureArraySatisfiesUnion } from '@app/shared-misc';
import { ControlSchemeBinding } from '@app/store';

import { BindingEditDetailsRenderDirective } from './binding-edit-details-render.directive';
import { BindingTypeToL10nKeyPipe } from '../binding-type-to-l10n-key.pipe';

const AVAILABLE_BINDING_TYPES = [
    'Speed',
    'Accelerate',
    'SetAngle',
    'Servo',
    'Stepper',
    'Train',
    'Gearbox'
] as const;

// making sure that the available binding types exhaustively match the ControlSchemeBindingType enum
const GUARDED_AVAILABLE_BINDING_TYPES: EnsureArraySatisfiesUnion<typeof ControlSchemeBindingType, typeof AVAILABLE_BINDING_TYPES> = AVAILABLE_BINDING_TYPES;

@Component({
    standalone: true,
    selector: 'lib-cs-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrl: './binding-edit.component.scss',
    imports: [
        MatCardModule,
        MatDividerModule,
        TranslocoPipe,
        MatSelectModule,
        BindingTypeToL10nKeyPipe,
        ReactiveFormsModule,
        BindingEditDetailsRenderDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'lib-cs-binding-edit'
})
export class BindingEditComponent {
    @Output() public readonly bindingChange = new EventEmitter<ControlSchemeBinding | null>();

    @Output() public readonly bindingFormDirtyChange: Observable<boolean>;

    public readonly availableBindingTypes = GUARDED_AVAILABLE_BINDING_TYPES.map((type) => ControlSchemeBindingType[type]);

    protected form = this.formBuilder.group({
        bindingType: this.formBuilder.control<ControlSchemeBindingType>(
            ControlSchemeBindingType.Speed,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    AppValidators.isInEnum(ControlSchemeBindingType)
                ]
            }
        )
    });

    private specificBindingDirty$ = new BehaviorSubject(false);

    private _binding: Partial<ControlSchemeBinding> | null = null;

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
        this.bindingFormDirtyChange = merge(
            this.form.statusChanges,
            this.specificBindingDirty$
        ).pipe(
            startWith(null),
            map(() => this.form.dirty || this.specificBindingDirty$.value),
            distinctUntilChanged()
        );
    }

    @Input()
    public set binding(
        binding: Partial<ControlSchemeBinding> | null
    ) {
        this._binding = binding;
        this.form.controls.bindingType.patchValue(binding?.bindingType ?? ControlSchemeBindingType.Speed);
    }

    public get binding(): Partial<ControlSchemeBinding> | null {
        return this._binding;
    }

    public onBindingChange(binding: ControlSchemeBinding | null): void {
        this.bindingChange.emit(binding);
        this.specificBindingDirty$.next(false);
    }

    public onBindingFormDirtyChange(dirty: boolean): void {
        this.specificBindingDirty$.next(dirty);
    }
}
