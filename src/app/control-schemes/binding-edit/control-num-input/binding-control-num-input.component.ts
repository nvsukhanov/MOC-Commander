import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-binding-control-num-input[controlTitle][control]',
    templateUrl: './binding-control-num-input.component.html',
    styleUrls: [ './binding-control-num-input.component.scss' ],
    imports: [
        NgIf,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlNumInputComponent {
    @Input() public min = Number.MIN_VALUE;

    @Input() public max = Number.MAX_VALUE;

    @Input() public control?: FormControl<number>;

    @Input() public controlTitle = '';
}
