import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-output-config-toggle-control[translocoTitle][control]',
    templateUrl: './output-config-toggle-control.component.html',
    styleUrls: [ './output-config-toggle-control.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        NgIf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputConfigToggleControlComponent {
    @Input() public translocoTitle = '';

    @Input() public control?: FormControl<boolean>;
}
