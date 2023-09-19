import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-control-ignore-input',
    templateUrl: './control-ignore-input.component.html',
    styleUrls: [ './control-ignore-input.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        NgIf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlIgnoreInputComponent {
    @Input() public control?: FormControl<boolean>;
}
