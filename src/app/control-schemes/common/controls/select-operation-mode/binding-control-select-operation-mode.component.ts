import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, map, of, startWith } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { BindingTypeToL10nKeyPipe, ControlSchemeBindingType } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-binding-select-operation-mode',
    templateUrl: './binding-control-select-operation-mode.component.html',
    styleUrls: [ './binding-control-select-operation-mode.component.scss' ],
    imports: [
        NgIf,
        BindingTypeToL10nKeyPipe,
        PushPipe,
        MatSelectModule,
        NgForOf,
        TranslocoModule,
        ReactiveFormsModule
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
