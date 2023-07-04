import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-output-config-slider-control[min][max][translocoTitle][control]',
    templateUrl: './output-config-slider-control.component.html',
    styleUrls: [ './output-config-slider-control.component.scss' ],
    imports: [
        MatSliderModule,
        NgIf,
        ReactiveFormsModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputConfigSliderControlComponent {
    @Input() public min = Number.MIN_VALUE;

    @Input() public max = Number.MAX_VALUE;

    @Input() public translocoTitle = '';

    @Input() public control?: FormControl<number>;
}
