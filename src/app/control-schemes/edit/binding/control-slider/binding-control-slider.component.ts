import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-output-config-slider-control[min][max][translocoTitle][control]',
    templateUrl: './binding-control-slider.component.html',
    styleUrls: [ './binding-control-slider.component.scss' ],
    imports: [
        MatSliderModule,
        NgIf,
        ReactiveFormsModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSliderComponent {
    @Input() public min = Number.MIN_VALUE;

    @Input() public max = Number.MAX_VALUE;

    @Input() public translocoTitle = '';

    @Input() public control?: FormControl<number>;
}
