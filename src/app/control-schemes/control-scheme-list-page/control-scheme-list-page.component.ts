import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { RoutesBuilderService } from '@app/routing';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel } from '@app/store';
import {
    ConfirmationDialogModule,
    ConfirmationDialogService,
    EllipsisTitleDirective,
    FeatureToolbarControlsDirective,
    HintComponent,
    ScreenSizeObserverService
} from '@app/shared';

import { CONTROL_SCHEMES_LIST_PAGE_SELECTORS } from './control-scheme-list-page.selectors';
import { ControlSchemeCreateDialogComponent } from './control-scheme-create-dialog';
import { ControlSchemeViewUrlPipe } from './control-scheme-view-url.pipe';
import { ExportControlSchemeDialogComponent, ExportControlSchemeDialogData, ImportControlSchemeDialogComponent } from '../common';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list-page',
    templateUrl: './control-scheme-list-page.component.html',
    styleUrls: [ './control-scheme-list-page.component.scss' ],
    imports: [
        LetDirective,
        NgForOf,
        NgIf,
        PushPipe,
        TranslocoPipe,
        MatButtonModule,
        RouterLink,
        MatCardModule,
        MatDialogModule,
        ControlSchemeViewUrlPipe,
        HintComponent,
        FeatureToolbarControlsDirective,
        ConfirmationDialogModule,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListPageComponent {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.selectSchemesList);

    public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.canCreateScheme);

    public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

    constructor(
        private readonly store: Store,
        protected readonly routesBuilderService: RoutesBuilderService,
        private readonly dialog: MatDialog,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly transloco: TranslocoService,
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }

    public trackSchemeById(index: number, scheme: ControlSchemeModel): string {
        return scheme.name;
    }

    public onImport(): void {
        this.dialog.open<ImportControlSchemeDialogComponent, undefined, ControlSchemeModel | void>(ImportControlSchemeDialogComponent)
            .afterClosed()
            .pipe(
                take(1),
                filter((r): r is ControlSchemeModel => !!r),
                concatLatestFrom((scheme: ControlSchemeModel) => this.store.select(CONTROL_SCHEME_SELECTORS.selectNextSchemeName(scheme.name)))
            ).subscribe(([ importedScheme, newName ]) => {
            const scheme = { ...importedScheme, name: newName };
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.importControlScheme({ scheme }));
            this.router.navigate(this.routesBuilderService.controlSchemeView(newName));
        });
    }

    public onExport(
        name: string
    ): void {
        this.dialog.open<ExportControlSchemeDialogComponent, ExportControlSchemeDialogData>(
            ExportControlSchemeDialogComponent,
            { data: { name } }
        );
    }

    public onCreate(): void {
        const dialogRef = this.dialog.open<ControlSchemeCreateDialogComponent, null, { name: string }>(
            ControlSchemeCreateDialogComponent,
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.router.navigate(
                    this.routesBuilderService.controlSchemeView(result.name)
                );
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.createControlScheme(result));
            }
        });
    }

    public onDelete(
        name: string
    ): void {
        this.confirmationDialogService.confirm(
            this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationTitle', { name }),
            {
                content$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationContent'),
                confirmTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationConfirmButtonTitle'),
                cancelTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationCancelButtonTitle')
            }
        ).subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteControlScheme({ name }));
            }
        });
    }
}
