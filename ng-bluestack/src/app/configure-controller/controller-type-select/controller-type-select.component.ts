import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControllerType } from '../../types';
import { L10nPipe, L10nService } from '../../l10n';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, KeyValuePipe, NgForOf } from '@angular/common';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings/controller-type-to-l10n';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-controller-type-select',
    templateUrl: './controller-type-select.component.html',
    imports: [
        MatSelectModule,
        KeyValuePipe,
        NgForOf,
        AsyncPipe,
        L10nPipe,
        FormsModule
    ],
    styleUrls: [ './controller-type-select.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ControllerTypeSelectComponent, multi: true }
    ]
})
export class ControllerTypeSelectComponent implements ControlValueAccessor {
    public readonly controllerTypes = MAPPING_CONTROLLER_TO_L10N;
    private _disabled = false;

    constructor(
        public readonly l10nService: L10nService,
    ) {
    }

    private _value: ControllerType | null = null;

    public get value(): ControllerType | null {
        return this._value;
    }

    public get stringifiedValue(): string | null {
        return this._value?.toString() ?? null;
    }

    public onSelect(v: string): void {
        this._value = +v;
        this._onChange(this._value);
        this._onTouched();
    }

    public registerOnChange(fn: (v: ControllerType | null) => undefined): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: () => undefined): void {
        this._onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
    }

    public writeValue(value: ControllerType): void {
        this._value = value;
    }

    private _onChange: (v: ControllerType | null) => undefined = () => undefined;

    private _onTouched: () => undefined = () => undefined;
}
