import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { map, of } from 'rxjs';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';
import { BreadcrumbsService, EllipsisTitleDirective, FeatureToolbarControlsDirective } from '@app/shared-ui';
import { CONTROL_SCHEME_NAME_IS_NOT_UNIQUE, ControlSchemeFormBuilderService } from '@app/shared-control-schemes';
import { IUnsavedChangesComponent, RoutesBuilderService, TitleService, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';

import { CURRENT_SCHEME_NAME } from './control-scheme-rename-page.selectors';

@Component({
    standalone: true,
    selector: 'page-control-scheme-rename',
    templateUrl: './control-scheme-rename-page.component.html',
    styleUrls: [ './control-scheme-rename-page.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardTitle,
        MatCardHeader,
        MatCard,
        MatCardContent,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        ValidationMessagesDirective,
        EllipsisTitleDirective,
        TranslocoPipe,
        MatLabel,
        MatError,
        FeatureToolbarControlsDirective,
        MatButton,
        RouterLink,
        MatAnchor
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
})
export class ControlSchemeRenamePageComponent implements IUnsavedChangesComponent, OnInit {
    public readonly currentSchemeName: Signal<string | null>;

    public cancelPath: string[] = [];

    protected readonly validationErrorsL10nMap: ValidationErrorsL10nMap = {
        [CONTROL_SCHEME_NAME_IS_NOT_UNIQUE]: 'controlScheme.newSchemeDialogNameUniqueness'
    };

    protected readonly nameFormControl: FormControl<string>;

    constructor(
        private readonly store: Store,
        private readonly formBuilder: ControlSchemeFormBuilderService,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly breadcrumbs: BreadcrumbsService,
        private readonly translocoService: TranslocoService,
        private readonly titleService: TitleService,
        private readonly router: Router
    ) {
        this.nameFormControl = this.formBuilder.controlSchemeNameControl();
        this.currentSchemeName = this.store.selectSignal(CURRENT_SCHEME_NAME);
    }

    public get hasUnsavedChanges(): boolean {
        return this.nameFormControl.dirty;
    }

    public canSave(): boolean {
        return this.nameFormControl.valid && this.nameFormControl.dirty;
    }

    public onSave(
        event: Event
    ): void {
        event.preventDefault();
        const previousName = this.currentSchemeName();
        if (this.canSave() && previousName !== null) {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.updateControlSchemeName({
                previousName,
                name: this.nameFormControl.value.trim()
            }));
            this.nameFormControl.markAsPristine();
            this.router.navigate(this.routesBuilderService.controlSchemeView(this.nameFormControl.value));
        }
    }

    public ngOnInit(): void {
        const previousName = this.currentSchemeName();
        if (previousName !== null) {
            this.nameFormControl.setValue(previousName);
            this.cancelPath = previousName !== null ? this.routesBuilderService.controlSchemeView(previousName) : [];

            this.breadcrumbs.setBreadcrumbsDef(
                of(previousName).pipe(
                    map((scheme) => [
                        {
                            label$: this.translocoService.selectTranslate('pageTitle.controlSchemesList'),
                            route: this.routesBuilderService.controlSchemesList
                        },
                        {
                            label$: of(previousName),
                            route: this.routesBuilderService.controlSchemeView(previousName)
                        },
                        {
                            label$: this.translocoService.selectTranslate('pageTitle.controlSchemeRename', { previousName }),
                            route: this.routesBuilderService.controlSchemeRename(scheme)
                        }
                    ])
                )
            );
            this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.controlSchemeRename', { previousName }));
        }
    }
}
