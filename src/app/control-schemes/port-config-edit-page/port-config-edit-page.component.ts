import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JsonPipe, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RoutesBuilderService, TitleService, ValidationMessagesDirective } from '@app/shared-misc';
import { HintComponent, PortIdToPortNamePipe, PortIdToPortNameService } from '@app/shared-ui';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';
import { PortConfigFormBuilderService } from '@app/shared-control-schemes';

import { PORT_CONFIG_EDIT_PAGE_SELECTORS } from './port-config-edit-page.selectors';
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
        TranslocoPipe,
        ReactiveFormsModule,
        MatButtonModule,
        PortIdToPortNamePipe,
        ValidationMessagesDirective
    ],
    providers: [
        TitleService
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
        private readonly router: Router,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly portIdToPortNameService: PortIdToPortNameService
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

        const pageTitle$ = this.store.select(PORT_CONFIG_EDIT_PAGE_SELECTORS.selectPortConfig).pipe(
            switchMap((portConfig) => {
                    const portId = this.portIdToPortNameService.mapPortId(portConfig?.portId ?? null);
                    return this.translocoService.selectTranslate(
                        'pageTitle.controlSchemePortEdit',
                        { portId, hubName: portConfig?.hubName, controlSchemeName: portConfig?.controlSchemeName }
                    );
                }
            ));
        this.titleService.setTitle$(pageTitle$);
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
                    const hubId = this.formGroup.controls.hubId.value;
                    const portId = this.formGroup.controls.portId.value;
                    if (hubId === null || portId === null) {
                        throw new Error('Hub ID and port ID must be set');
                    }
                    this.store.dispatch(CONTROL_SCHEME_ACTIONS.savePortConfig({
                        schemeName: portConfig.controlSchemeName,
                        portConfig: {
                            ...this.formGroup.getRawValue(),
                            hubId,
                            portId
                        }
                    }));
                    this.router.navigate(
                        this.routesBuilder.controlSchemeView(portConfig.controlSchemeName)
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
                    this.routesBuilder.controlSchemeView(portConfig.controlSchemeName)
                );
            }
        });
    }
}
