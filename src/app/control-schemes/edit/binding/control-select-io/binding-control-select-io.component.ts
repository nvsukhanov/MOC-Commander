import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Observable, map, of, startWith } from 'rxjs';
import { IOType } from '@nvsukhanov/rxpoweredup';
import { AttachedIoModel } from '@app/store';
import { HubIoOperationMode, IoOperationTypeToL10nKeyPipe, IoTypeToL10nKeyPipe } from '@app/shared';

import { BindingEditAvailableOperationModesModel } from '../../../control-schemes-feature.selectors';

@Component({
    standalone: true,
    selector: 'app-binding-control-select-io',
    templateUrl: './binding-control-select-io.component.html',
    styleUrls: [ './binding-control-select-io.component.scss' ],
    imports: [
        IoOperationTypeToL10nKeyPipe,
        MatFormFieldModule,
        MatOptionModule,
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
    @Input() public control?: FormControl<number>;

    @Input() public availabilityData: BindingEditAvailableOperationModesModel = {};

    @Input() public operationMode?: HubIoOperationMode;

    @Input() public hubId?: string;

    private _availableIos: AttachedIoModel[] = [];

    private _ioType$: Observable<IOType | null> = of(null);

    public get availableIos(): AttachedIoModel[] {
        return this._availableIos;
    }

    public get ioType$(): Observable<IOType | null> {
        return this._ioType$;
    }

    public ngOnChanges(): void {
        if (this.hubId === undefined || this.operationMode === undefined) {
            this.control?.reset();
            this._availableIos = [];
            this._ioType$ = of(null);
            return;
        }
        const hubIoData = this.availabilityData[this.operationMode]?.hubIos ?? {};
        if (!hubIoData[this.hubId]) {
            this.control?.reset();
            this._availableIos = [];
            this._ioType$ = of(null);
            return;
        }
        this._availableIos = hubIoData[this.hubId];
        if (!this.control) {
            this._ioType$ = of(null);
            return;
        }
        if (!this._availableIos.length) {
            this.control?.reset();
            this._ioType$ = of(null);
            return;
        }
        if (!this._availableIos.find((io) => io.portId === this.control?.value)) {
            this.control.setValue(this._availableIos[0].portId);
            this.control.updateValueAndValidity();
        }
        this._ioType$ = this.control.valueChanges.pipe(
            startWith(this.control.value),
            map((portId) => this._availableIos.find((io) => io.portId === portId)?.ioType ?? null)
        );
    }
}
