import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';

import { IdGeneratorService } from '../../id-generator.service';
import { getFormControlMaxValue, getFormControlMinValue } from '../../form-helpers';

@Component({
    standalone: true,
    selector: 'app-slider-control',
    templateUrl: './slider-control.component.html',
    styleUrls: [ './slider-control.component.scss' ],
    imports: [
        MatSliderModule,
        NgIf,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderControlComponent {
    @Input() public step = 1;

    public readonly id = this.idGeneratorService.generateId();

    private _control?: FormControl<number>;

    private _min = -Number.MAX_VALUE;

    private _max = Number.MAX_VALUE;

    constructor(
        private readonly idGeneratorService: IdGeneratorService,
    ) {
    }

    @Input()
    public set control(
        v: FormControl<number> | undefined
    ) {
        if (!v) {
            this._control = undefined;
            this._min = -Number.MAX_VALUE;
            this._max = Number.MAX_VALUE;
        } else {
            this._control = v;
            this._min = getFormControlMinValue(v);
            this._max = getFormControlMaxValue(v);
        }
    }

    public get control(): FormControl<number> | undefined {
        return this._control;
    }

    public get min(): number {
        return this._min;
    }

    public get max(): number {
        return this._max;
    }
}
