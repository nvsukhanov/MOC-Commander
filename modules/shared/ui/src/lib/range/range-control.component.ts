import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoPipe } from '@ngneat/transloco';
import { IdGeneratorService, getFormControlMaxValue, getFormControlMinValue } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'lib-range-control',
    templateUrl: './range-control.component.html',
    styleUrls: [ './range-control.component.scss' ],
    imports: [
        MatSliderModule,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeControlComponent {
    @Input() public step = 1;

    public readonly startId = this.idGeneratorService.generateId();

    public readonly endId = this.idGeneratorService.generateId();

    private _startControl?: FormControl<number>;

    private _endControl?: FormControl<number>;

    private _min = -Number.MAX_VALUE;

    private _max = Number.MAX_VALUE;

    constructor(
        private readonly idGeneratorService: IdGeneratorService,
    ) {
    }

    @Input()
    public set startControl(
        v: FormControl<number> | undefined
    ) {
        this._startControl = v;
        this.updateMinMax();
    }

    public get startControl(): FormControl<number> | undefined {
        return this._startControl;
    }

    @Input()
    public set endControl(
        v: FormControl<number> | undefined
    ) {
        this._endControl = v;
        this.updateMinMax();
    }

    public get endControl(): FormControl<number> | undefined {
        return this._endControl;
    }

    public get min(): number {
        return this._min;
    }

    public get max(): number {
        return this._max;
    }

    private updateMinMax(): void {
        if (!this._startControl || !this._endControl) {
            this._min = -Number.MAX_VALUE;
            this._max = Number.MAX_VALUE;
            return;
        }
        const startMin = getFormControlMinValue(this._startControl);
        const endMin = getFormControlMinValue(this._endControl);
        const startMax = getFormControlMaxValue(this._startControl);
        const endMax = getFormControlMaxValue(this._endControl);
        this._min = Math.max(startMin, endMin);
        this._max = Math.min(startMax, endMax);
    }
}
