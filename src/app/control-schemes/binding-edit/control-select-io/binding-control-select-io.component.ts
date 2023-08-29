import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Observable, map, of, startWith } from 'rxjs';
import { AttachedIoModel } from '@app/store';
import { IoTypeToL10nKeyPipe } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-binding-control-select-io',
    templateUrl: './binding-control-select-io.component.html',
    styleUrls: [ './binding-control-select-io.component.scss' ],
    imports: [
        MatSelectModule,
        NgForOf,
        NgIf,
        TranslocoModule,
        ReactiveFormsModule,
        IoTypeToL10nKeyPipe,
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectIoComponent implements OnChanges {
    @Input() public hubIos: AttachedIoModel[] = [];

    @Input() public portIdControl?: FormControl<number>;

    private _isSelectedIoAttached$: Observable<boolean> = of(false);

    public get isSelectedIoAttached$(): Observable<boolean> {
        return this._isSelectedIoAttached$;
    }

    public ngOnChanges(): void {
        if (this.portIdControl === undefined) {
            this._isSelectedIoAttached$ = of(false);
        } else {
            this._isSelectedIoAttached$ = this.portIdControl.valueChanges.pipe(
                startWith(this.portIdControl.value),
                map((portId) => {
                    return this.hubIos.some((io) => io.portId === portId);
                })
            );
        }
    }
}
