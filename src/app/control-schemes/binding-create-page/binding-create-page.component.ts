import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { FeatureToolbarControlsDirective, HintComponent, RoutesBuilderService, TitleService } from '@app/shared-misc';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';

import { BindingEditComponent } from '../common';
import { BINDING_CREATE_PAGE_SELECTORS } from './binding-create-page.selectors';

@Component({
    standalone: true,
    selector: 'app-binding-create-page',
    templateUrl: './binding-create-page.component.html',
    styleUrls: [ './binding-create-page.component.scss' ],
    imports: [
        BindingEditComponent,
        PushPipe,
        NgIf,
        MatButtonModule,
        HintComponent,
        TranslocoPipe,
        FeatureToolbarControlsDirective
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingCreatePageComponent implements OnInit {
    public readonly initialBindingData$: Observable<Partial<ControlSchemeBinding | null>>;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService
    ) {
        this.initialBindingData$ = this.store.select(BINDING_CREATE_PAGE_SELECTORS.selectDataForNewBinding).pipe(
            take(1)
        );
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(
            this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName).pipe(
                switchMap((controlSchemeName) => this.translocoService.selectTranslate('pageTitle.bindingCreate', { controlSchemeName }))
            )
        );
    }

    public onCancel(): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName).pipe(
            take(1),
            filter((schemeName): schemeName is string => (schemeName) !== null)
        ).subscribe((schemeName) => {
            this.router.navigate(
                this.routesBuilderService.controlSchemeView(schemeName)
            );
        });
    }

    public onSave(
        binding: ControlSchemeBinding
    ): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName).pipe(
            take(1),
            filter((schemeName): schemeName is string => (schemeName) !== null)
        ).subscribe((schemeName) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.createBinding({
                schemeName: schemeName,
                binding
            }));
            this.router.navigate(
                this.routesBuilderService.controlSchemeView(schemeName)
            );
        });
    }
}
