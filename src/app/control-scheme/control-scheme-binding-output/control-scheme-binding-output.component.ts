import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { HUBS_SELECTORS } from '../../store';
import { MatSelectModule } from '@angular/material/select';
import { LetModule, PushModule } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type ControlSchemeBindingOutputControl = FormGroup<{
    hubId: FormControl<string | null>,
    portId: FormControl<number | null>,
    portModeId: FormControl<number | null>,
}>

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-output',
    templateUrl: './control-scheme-binding-output.component.html',
    styleUrls: [ './control-scheme-binding-output.component.scss' ],
    imports: [
        MatSelectModule,
        LetModule,
        PushModule,
        NgForOf,
        ReactiveFormsModule,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingOutputComponent {
    @Input() public formGroup?: ControlSchemeBindingOutputControl;

    public readonly hubsList$ = this.store.select(HUBS_SELECTORS.selectHubs);

    constructor(
        private readonly store: Store
    ) {
    }
}
