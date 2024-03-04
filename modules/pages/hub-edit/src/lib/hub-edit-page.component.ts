import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, distinctUntilChanged, filter, map, of, startWith, switchMap, take } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { IUnsavedChangesComponent, RoutesBuilderService, TitleService, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { FeatureToolbarBreadcrumbsDirective, FeatureToolbarControlsDirective, HintComponent, IBreadcrumbDefinition } from '@app/shared-ui';
import { HUBS_ACTIONS, HubModel, ROUTER_SELECTORS } from '@app/store';

import { HUB_EDIT_PAGE_SELECTORS } from './hub-edit-page.selectors';

@Component({
    standalone: true,
    selector: 'page-hub-edit',
    templateUrl: './hub-edit-page.component.html',
    styleUrls: [ './hub-edit-page.component.scss' ],
    imports: [
        TranslocoPipe,
        HintComponent,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        ValidationMessagesDirective,
        RouterLink,
        FeatureToolbarControlsDirective,
        FeatureToolbarBreadcrumbsDirective,
        AsyncPipe
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubEditPageComponent implements OnInit, OnDestroy, IUnsavedChangesComponent {
    public readonly isHubConnected$ = this.store.select(HUB_EDIT_PAGE_SELECTORS.selectIsEditedHubConnected);

    public readonly editedHubConfiguration$ = this.store.select(HUB_EDIT_PAGE_SELECTORS.selectEditedHubModel);

    public readonly isSaving$: Observable<boolean> = this.store.select(HUB_EDIT_PAGE_SELECTORS.selectIsEditedHubIsSaving);

    public readonly hasUnsavedChanges: Observable<boolean>;

    public readonly cancelPath$: Observable<string[]> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId).pipe(
        map((id) => id !== null ? this.routesBuilderService.hubView(id) : [])
    );

    public readonly form: FormGroup<{
        name: FormControl<string | null>;
    }>;

    public readonly validationErrorsMap: ValidationErrorsL10nMap = {
        minlength: 'hub.hubNameErrorMinLength',
        maxlength: 'hub.hubNameErrorMaxLength',
        pattern: 'hub.hubNameErrorPattern'
    };

    public readonly breadcrumbsDef$: Observable<ReadonlyArray<IBreadcrumbDefinition>>;

    private readonly maxHubNameLength = 14;

    private readonly subscriptions = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly actions: Actions,
        private readonly router: Router,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        formBuilder: FormBuilder
    ) {
        this.form = formBuilder.group({
            name: formBuilder.control<string | null>(null, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(this.maxHubNameLength),
                Validators.pattern(/^[a-zA-Z0-9_.\s-]+$/)
            ])
        });

        this.breadcrumbsDef$ = this.editedHubConfiguration$.pipe(
            filter((hub): hub is HubModel => hub !== undefined),
            map((hub) => ([
                {
                    label$: this.translocoService.selectTranslate('pageTitle.hubsList'),
                    route: this.routesBuilderService.hubsList
                },
                {
                    label$: of(hub.name),
                    route: this.routesBuilderService.hubView(hub.hubId)
                },
                {
                    label$: this.translocoService.selectTranslate('pageTitle.hubEdit'),
                    route: this.routesBuilderService.hubEdit(hub.hubId)
                }
            ]))
        );

        this.hasUnsavedChanges = this.form.statusChanges.pipe(
            startWith(null),
            map(() => this.form.dirty),
            distinctUntilChanged()
        );
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.editedHubConfiguration$.pipe(
                filter((hub): hub is HubModel => hub !== undefined),
                take(1)
            ).subscribe((hub) => {
                this.form.controls.name.setValue(hub.name);
            })
        );
        const title$ = this.editedHubConfiguration$.pipe(
            filter((hubModel): hubModel is HubModel => !!hubModel),
            switchMap((hubModel) => this.translocoService.selectTranslate('pageTitle.hubEditWithHubName', { hubName: hubModel.name }))
        );
        this.titleService.setTitle$(title$);
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onSave(
        hubId: string
    ): void {
        const name = this.form.controls.name.value;
        if (this.form.valid && name !== null) {
            this.store.dispatch(HUBS_ACTIONS.requestSetHubName({ name, hubId }));
            this.subscriptions.add(
                this.actions.pipe(
                    ofType(HUBS_ACTIONS.hubNameSet, HUBS_ACTIONS.hubNameSetError),
                    filter((action) => action.hubId === hubId),
                    take(1)
                ).subscribe((action) => {
                    if (action.type === HUBS_ACTIONS.hubNameSet.type) {
                        this.form.markAsPristine();
                        this.router.navigate(this.routesBuilderService.hubView(hubId));
                    }
                })
            );
        }
    }
}
