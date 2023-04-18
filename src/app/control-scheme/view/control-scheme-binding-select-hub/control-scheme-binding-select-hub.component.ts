import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
import { NgForOf } from '@angular/common';
import { HubConfiguration } from '../../../store';

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-select-hub',
    templateUrl: './control-scheme-binding-select-hub.component.html',
    styleUrls: [ './control-scheme-binding-select-hub.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatSelectModule,
        TranslocoModule,
        NgForOf
    ],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ControlSchemeBindingSelectHubComponent, multi: true }
    ]
})
export class ControlSchemeBindingSelectHubComponent implements ControlValueAccessor {
    @Input() public knownHubs: HubConfiguration[] = [];

    private _value: string | null = null;

    private _isDisabled = false;

    constructor(
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public set value(nextValue: string | null) {
        if (nextValue !== this._value) {
            this._value = nextValue;
            this._onChange(nextValue);
            this._onTouched();
        }
    }

    public get value(): string | null {
        return this._value;
    }

    public get isDisabled(): boolean {
        return this._isDisabled;
    }

    public registerOnChange(fn: (hubId: string | null) => void): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: unknown): void {
        this._onTouched = fn as () => void;
    }

    public setDisabledState(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
        this.cd.markForCheck();
    }

    public writeValue(nextValue: string): void {
        if (this._value !== nextValue) {
            this._value = nextValue;
            this.cd.markForCheck();
        }
    }

    private _onChange: (hubId: string | null) => void = () => void 0;

    private _onTouched: () => void = () => void 0;
}
