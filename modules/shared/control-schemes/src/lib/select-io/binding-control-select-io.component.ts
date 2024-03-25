import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable, Subscription, map, of, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { IoTypeToL10nKeyPipe, PortIdToPortNamePipe } from '@app/shared-components';
import { AttachedIoModel, attachedIosIdFn } from '@app/store';

import { BINDING_CONTROL_SELECT_IO_SELECTORS } from './binding-control-select-io.selectors';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-control-select-io',
    templateUrl: './binding-control-select-io.component.html',
    styleUrls: [ './binding-control-select-io.component.scss' ],
    imports: [
        MatSelectModule,
        TranslocoPipe,
        ReactiveFormsModule,
        IoTypeToL10nKeyPipe,
        PortIdToPortNamePipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectIoComponent implements OnChanges, OnDestroy {
    @Input() public hubIdControl?: FormControl<string | null>;

    @Input() public portIdControl?: FormControl<number | null>;

    @Input() public bindingType?: ControlSchemeBindingType;

    private _isSelectedIoAttached$: Observable<boolean> = of(false);

    private _availableIos: Observable<AttachedIoModel[]> = of([]);

    private formUpdateSubscription?: Subscription;

    constructor(
        private readonly store: Store
    ) {
    }

    public get availableIos$(): Observable<AttachedIoModel[]> {
        return this._availableIos;
    }

    public get isSelectedIoAttached$(): Observable<boolean> {
        return this._isSelectedIoAttached$;
    }

    public trackIo(
        index: number,
        item: AttachedIoModel
    ): string {
        return attachedIosIdFn(item);
    }

    public ngOnChanges(): void {
        this.formUpdateSubscription?.unsubscribe();
        if (this.portIdControl === undefined) {
            this._isSelectedIoAttached$ = of(false);
        } else {
            this._isSelectedIoAttached$ = this.portIdControl.valueChanges.pipe(
                startWith(null),
                switchMap(() => this._availableIos),
                map((availableIos) => {
                    return availableIos.some((io) => io.portId === this.portIdControl?.value);
                })
            );
        }

        if (this.bindingType !== undefined && this.hubIdControl !== undefined) {
            this._availableIos = this.hubIdControl?.valueChanges.pipe(
                startWith(null),
                switchMap(() => {
                    const hubId = this.hubIdControl?.value;
                    const bindingType = this.bindingType;
                    if (!hubId || bindingType === undefined) {
                        return of([]);
                    }
                    return this.store.select(BINDING_CONTROL_SELECT_IO_SELECTORS.selectControllableIos({ hubId, bindingType }));
                })
            );
        } else {
            this._availableIos = of([]);
        }

        if (this.portIdControl && this.hubIdControl) {
            this.formUpdateSubscription = this.hubIdControl.valueChanges.pipe(
                startWith(null),
                concatLatestFrom(() => this._availableIos),
            ).subscribe(([ , availableIos ]) => {
                if (!this.portIdControl || !availableIos.length) {
                    return;
                }
                if (this.portIdControl.invalid) {
                    this.portIdControl.setValue(availableIos[0].portId);
                    this.portIdControl.markAsDirty();
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription?.unsubscribe();
    }
}
