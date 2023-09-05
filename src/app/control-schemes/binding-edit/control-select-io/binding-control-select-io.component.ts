import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { Observable, Subscription, map, of, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/effects';
import { AttachedIoModel } from '@app/store';
import { ControlSchemeBindingType, IoTypeToL10nKeyPipe, PortIdToPortNamePipe } from '@app/shared';

import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';

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
        PushPipe,
        PortIdToPortNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectIoComponent implements OnChanges, OnDestroy {
    @Input() public portIdControl?: FormControl<number>;

    @Input() public bindingType?: ControlSchemeBindingType;

    private _isSelectedIoAttached$: Observable<boolean> = of(false);

    private _availableIos: Observable<AttachedIoModel[]> = of([]);

    private formUpdateSubscription?: Subscription;

    private _hubId?: string;

    constructor(
        private readonly store: Store
    ) {
    }

    @Input()
    public set hubId(
        v: string | undefined
    ) {
        if (v !== this._hubId) {
            this._hubId = v;
            this.formUpdateSubscription?.unsubscribe();
            this.portIdControl?.reset();
        }
    }

    public get hubId(): string | undefined {
        return this._hubId;
    }

    public get availableIos$(): Observable<AttachedIoModel[]> {
        return this._availableIos;
    }

    public get isSelectedIoAttached$(): Observable<boolean> {
        return this._isSelectedIoAttached$;
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

        if (this.bindingType !== undefined && this.hubId !== undefined) {
            this._availableIos = this.store.select(BINDING_EDIT_SELECTORS.selectControllableIos({
                hubId: this.hubId,
                bindingType: this.bindingType
            }));
        } else {
            this._availableIos = of([]);
        }

        if (this.portIdControl && this._hubId) {
            this.formUpdateSubscription = this.portIdControl.valueChanges.pipe(
                startWith(null),
                concatLatestFrom(() => this._availableIos),
            ).subscribe(([ , availableIos ]) => {
                if (!this.portIdControl) {
                    return;
                }
                if (this.portIdControl.invalid && availableIos.length > 0) {
                    this.portIdControl.setValue(availableIos[0].portId);
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription?.unsubscribe();
    }
}
