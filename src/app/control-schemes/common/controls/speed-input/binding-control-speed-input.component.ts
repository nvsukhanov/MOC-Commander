import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { ValidationMessagesDirective } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-binding-control-speed-input',
    templateUrl: './binding-control-speed-input.component.html',
    styleUrls: [ './binding-control-speed-input.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        ReactiveFormsModule,
        TranslocoPipe,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSpeedInputComponent {
    @Input() public translocoTitle = 'controlScheme.outputSpeed';

    @Input() public control?: FormControl<number>;
}
