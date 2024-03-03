import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'lib-toggle-control[translocoTitle][control]',
    templateUrl: './toggle-control.component.html',
    styleUrls: [ './toggle-control.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleControlComponent {
    @Input() public translocoTitle = '';

    @Input() public control?: FormControl<boolean>;
}
