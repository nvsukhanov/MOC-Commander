import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-range-control',
    templateUrl: './range-control.component.html',
    styleUrls: [ './range-control.component.scss' ],
    imports: [
        MatSliderModule,
        NgIf,
        ReactiveFormsModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeControlComponent {
    @Input() public min = Number.MIN_VALUE;

    @Input() public max = Number.MAX_VALUE;
    
    @Input() public step = 1;

    @Input() public startControl?: FormControl<number>;

    @Input() public endControl?: FormControl<number>;
}
