import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    standalone: true,
    selector: 'page-controller-view-control-ignore-input',
    templateUrl: './control-ignore-input.component.html',
    styleUrls: [ './control-ignore-input.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlIgnoreInputComponent {
    @Input() public control?: FormControl<boolean>;
}
