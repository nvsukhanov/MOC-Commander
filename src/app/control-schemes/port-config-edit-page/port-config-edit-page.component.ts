import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JsonPipe, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/routing';
import { HintComponent, PortIdToPortNamePipe } from '@app/shared';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';

import { PORT_CONFIG_EDIT_PAGE_SELECTORS } from './port-config-edit-page.selectors';
import { PortConfigFormBuilderService } from '../common';
import { PortConfigEditViewModel } from './port-config-edit-view-model';

@Component({
    standalone: true,
    selector: 'app-port-config-edit-page',
    templateUrl: './port-config-edit-page.component.html',
    styleUrls: [ './port-config-edit-page.component.scss' ],
    imports: [
        NgIf,
        PushPipe,
        JsonPipe,
        HintComponent,
        MatCardModule,
        MatInputModule,
        TranslocoModule,
        ReactiveFormsModule,
        MatButtonModule,
        PortIdToPortNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortConfigEditPageComponent implements OnInit, OnDestroy {
    public readonly portConfig$: Observable<PortConfigEditViewModel | null> = this.store.select(PORT_CONFIG_EDIT_PAGE_SELECTORS.selectPortConfig);

    public readonly minAccDecProfileTimeMs = PortConfigFormBuilderService.minAccDecProfileTimeMs;

    public readonly maxAccDecProfileTimeMs = PortConfigFormBuilderService.maxAccDecProfileTimeMs;

    public readonly formGroup = this.formBuilder.build();

    private readonly sub = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly formBuilder: PortConfigFormBuilderService,
        private readonly routesBuilder: RoutesBuilderService,
        private readonly router: Router
    ) {
    }

    public get isSubmitDisabled(): boolean {
        return this.formGroup.invalid || this.formGroup.pristine;
    }

    public ngOnInit(): void {
        this.sub.add(
            this.portConfig$.subscribe((portConfig) => {
                if (portConfig) {
                    this.formGroup.controls.hubId.setValue(portConfig.hubId);
                    this.formGroup.controls.portId.setValue(portConfig.portId);
                    this.formGroup.controls.accelerationTimeMs.setValue(portConfig.accelerationTimeMs);
                    this.formGroup.controls.decelerationTimeMs.setValue(portConfig.decelerationTimeMs);
                }
            })
        );
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public onSubmit(
        event: Event
    ): void {
        event.preventDefault();
        if (!this.isSubmitDisabled) {
            this.portConfig$.pipe(
                take(1)
            ).subscribe((portConfig) => {
                if (portConfig) {
                    this.store.dispatch(CONTROL_SCHEME_ACTIONS.savePortConfig({
                        schemeName: portConfig.schemeName,
                        portConfig: this.formGroup.getRawValue()
                    }));
                    this.router.navigate(
                        this.routesBuilder.controlSchemeView(portConfig.schemeName)
                    );
                }
            });
        }
    }

    public onCancel(): void {
        this.portConfig$.pipe(
            take(1)
        ).subscribe((portConfig) => {
            if (portConfig) {
                this.router.navigate(
                    this.routesBuilder.controlSchemeView(portConfig.schemeName)
                );
            }
        });
    }
}
