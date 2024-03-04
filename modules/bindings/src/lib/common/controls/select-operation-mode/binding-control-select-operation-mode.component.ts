import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable, map, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { BindingTypeToL10nKeyPipe } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-select-operation-mode',
    templateUrl: './binding-control-select-operation-mode.component.html',
    styleUrls: [ './binding-control-select-operation-mode.component.scss' ],
    imports: [
        BindingTypeToL10nKeyPipe,
        MatSelectModule,
        TranslocoPipe,
        ReactiveFormsModule,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectOperationModeComponent implements OnChanges {
    @Input() public availableBindingTypes?: ReadonlyArray<ControlSchemeBindingType>;

    @Input() public control?: FormControl<ControlSchemeBindingType>;

    private _isBindingTypeUnsupported$: Observable<boolean> = of(true);

    public get isBindingTypeUnsupported$(): Observable<boolean> {
        return this._isBindingTypeUnsupported$;
    }

    public ngOnChanges(): void {
        if (this.availableBindingTypes && this.control) {
            this._isBindingTypeUnsupported$ = this.control.valueChanges.pipe(
                startWith(this.control.value),
                map((value) => !this.availableBindingTypes || !this.availableBindingTypes.includes(value))
            );
        } else {
            this._isBindingTypeUnsupported$ = of(true);
        }
    }
}
