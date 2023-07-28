import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, combineLatestWith, map, mergeWith, of, startWith } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { Dictionary } from '@ngrx/entity';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { HubModel } from '@app/store';

import { ControlSchemePortConfigForm } from '../../types';

@Component({
    standalone: true,
    selector: 'app-control-scheme-hub-configuration',
    templateUrl: './control-scheme-hub-configuration.component.html',
    styleUrls: [ './control-scheme-hub-configuration.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        PushPipe,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeHubConfigurationComponent implements OnChanges {
    @Input() public configForm?: ControlSchemePortConfigForm;

    @Input() public knownHubs?: Dictionary<HubModel>;

    private _shouldDisplayHubConfiguration$: Observable<boolean> = of(false);

    private _accelerationProfileInputActive$: Observable<boolean> = of(false);

    private _decelerationProfileInputActive$: Observable<boolean> = of(false);

    private _titleData$: Observable<{ hubName: string; portId: number }> = of({ hubName: '', portId: -1 });

    public get shouldDisplayHubConfiguration$(): Observable<boolean> {
        return this._shouldDisplayHubConfiguration$;
    }

    public get titleData$(): Observable<{ hubName: string; portId: number }> {
        return this._titleData$;
    }

    public get accelerationProfileInputActive$(): Observable<boolean> {
        return this._accelerationProfileInputActive$;
    }

    public get decelerationProfileInputActive$(): Observable<boolean> {
        return this._decelerationProfileInputActive$;
    }

    public ngOnChanges(): void {
        if (this.configForm) {
            this._accelerationProfileInputActive$ = this.configForm.controls.useAccelerationProfile.valueChanges.pipe(
                startWith(this.configForm.controls.useAccelerationProfile.value),
                map(() => !!this.configForm?.controls.useAccelerationProfile.value
                )
            );

            this._decelerationProfileInputActive$ = this.configForm.controls.useDecelerationProfile.valueChanges.pipe(
                startWith(this.configForm.controls.useDecelerationProfile.value),
                map(() => !!this.configForm?.controls.useDecelerationProfile.value)
            );

            this._shouldDisplayHubConfiguration$ = this._accelerationProfileInputActive$.pipe(
                combineLatestWith(this._decelerationProfileInputActive$),
                map(([ shouldShowAccelerationProfile, shouldShowDecelerationProfile ]) => {
                        return shouldShowAccelerationProfile || shouldShowDecelerationProfile;
                    }
                ));

            this._titleData$ = this.configForm.controls.hubId.valueChanges.pipe(
                mergeWith(this.configForm.controls.portId.valueChanges),
                startWith(null),
                map(() => {
                    const hubId = this.configForm?.controls.hubId.value;
                    const portId = this.configForm?.controls.portId.value;
                    const hubModel = hubId !== undefined && this.knownHubs && this.knownHubs[hubId];
                    if (!hubModel || portId === undefined) {
                        return { hubName: '', portId: -1 };
                    }
                    return { hubName: hubModel.name, portId };
                })
            );
        } else {
            this._shouldDisplayHubConfiguration$ = of(false);
        }
    }
}
