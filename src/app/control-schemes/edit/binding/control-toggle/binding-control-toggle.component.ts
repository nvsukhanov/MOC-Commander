import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-binding-toggle-control[translocoTitle][control]',
    templateUrl: './binding-control-toggle.component.html',
    styleUrls: [ './binding-control-toggle.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        NgIf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlToggleComponent {
    @Input() public translocoTitle = '';

    @Input() public control?: FormControl<boolean>;
}
