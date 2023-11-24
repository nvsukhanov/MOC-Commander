import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@ngneat/transloco';
import { EllipsisTitleDirective } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'app-control-scheme-general-info',
    templateUrl: './control-scheme-general-info.component.html',
    styleUrls: [ './control-scheme-general-info.component.scss' ],
    imports: [
        NgIf,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoPipe,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeGeneralInfoComponent {
    @Output() public readonly nameChange = new EventEmitter<string>();

    protected readonly nameFormControl: FormControl<string>;

    private _name = '';

    private _isEditing = false;

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
        this.nameFormControl = this.formBuilder.control<string>(
            '',
            { nonNullable: true, validators: [ Validators.required ] }
        );
    }

    @Input()
    public set name(
        name: string | null
    ) {
        if (name === null) {
            this._name = '';
        } else {
            this._name = name;
        }
        this.nameFormControl.setValue(this._name);
    }

    public get name(): string {
        return this._name;
    }

    public get isEditing(): boolean {
        return this._isEditing;
    }

    public onEditMode(): void {
        this._isEditing = true;
    }

    public canSave(): boolean {
        return this.nameFormControl.valid && this.nameFormControl.dirty;
    }

    public onSave(
        event: Event
    ): void {
        event.preventDefault();
        if (this.canSave()) {
            this.nameChange.emit(this.nameFormControl.value);
            this.nameFormControl.setValue(this._name);
            this._isEditing = false;
        }
    }

    public onCancel(): void {
        this._isEditing = false;
        this.nameFormControl.setValue(this._name);
    }
}
