import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable, Subscription, map, of, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { BINDING_CONTROL_SELECT_HUB_SELECTORS, HubWithConnectionState } from './binding-control-select-hub.selectors';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-control-select-hub',
    templateUrl: './binding-control-select-hub.component.html',
    styleUrl: './binding-control-select-hub.component.scss',
    imports: [
        MatSelectModule,
        ReactiveFormsModule,
        TranslocoPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectHubComponent implements OnChanges, OnDestroy {
    @Input() public control?: FormControl<string | null>;

    @Input() public bindingType?: ControlSchemeBindingType;

    private _hubsWithConnectionState$: Observable<HubWithConnectionState[]> = of([]);

    private _isHubKnown$: Observable<boolean> = of(false);

    private formUpdateSubscription?: Subscription;

    constructor(
        private readonly store: Store
    ) {
    }

    public get hubsWithConnectionState$(): Observable<HubWithConnectionState[]> {
        return this._hubsWithConnectionState$;
    }

    public get isHubKnown$(): Observable<boolean> {
        return this._isHubKnown$;
    }

    public ngOnChanges(): void {
        this.formUpdateSubscription?.unsubscribe();

        if (this.bindingType !== undefined) {
            this._hubsWithConnectionState$ = this.store.select(BINDING_CONTROL_SELECT_HUB_SELECTORS.selectControllableHubs(this.bindingType));
        } else {
            this._hubsWithConnectionState$ = of([]);
        }

        if (this.control) {
            this._isHubKnown$ = this.control.valueChanges.pipe(
                startWith(null),
                switchMap(() => this._hubsWithConnectionState$),
                map((hubsWithConnectionStates) => {
                    if (!this.control) {
                        return false;
                    }
                    return hubsWithConnectionStates.some((hubWithConnectionState) => hubWithConnectionState.hubId === this.control?.value);
                }),
            );

            this.formUpdateSubscription = this.control.valueChanges.pipe(
                startWith(null),
                switchMap(() => this._hubsWithConnectionState$),
            ).subscribe((hubsWithConnectionStates) => {
                // If the control is empty (invalid), set it to the first available hub
                if (this.control && this.control.invalid) {
                    const firstHub = hubsWithConnectionStates[0];
                    if (firstHub) {
                        this.control.setValue(firstHub.hubId);
                    } else {
                        this.control.reset();
                    }
                }
            });
        } else {
            this._isHubKnown$ = of(false);
        }
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription?.unsubscribe();
    }
}
