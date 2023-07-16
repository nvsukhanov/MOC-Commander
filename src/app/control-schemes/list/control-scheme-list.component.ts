import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeModel } from '@app/store';

import { FeatureToolbarService } from '@app/shared';
import { RoutesBuilderService } from '../../routing';
import { ControlSchemeListItemComponent } from './control-scheme-list-item';
import { ControlSchemeDeleteDialogComponent } from '../control-scheme-delete-dialog';
import { CONTROL_SCHEMES_LIST_SELECTORS } from './control-schemes-list.selectors';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list',
    templateUrl: './control-scheme-list.component.html',
    styleUrls: [ './control-scheme-list.component.scss' ],
    imports: [
        LetDirective,
        NgForOf,
        NgIf,
        PushPipe,
        TranslocoModule,
        ControlSchemeListItemComponent,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatCardModule,
        MatListModule,
        MatDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListComponent implements OnDestroy {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEMES_LIST_SELECTORS.selectSchemesList);

    public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEMES_LIST_SELECTORS.canCreateScheme);

    constructor(
        private readonly store: Store,
        private readonly featureToolbarService: FeatureToolbarService,
        protected readonly routesBuilderService: RoutesBuilderService,
        private readonly dialog: MatDialog,
    ) {
    }

    @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        if (controls) {
            this.featureToolbarService.setControls(controls);
        } else {
            this.featureToolbarService.clearConfig();
        }
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearConfig();
    }

    public trackSchemeById(index: number, scheme: ControlSchemeModel): string {
        return scheme.id;
    }

    public onDelete(
        id: string,
        name: string
    ): void {
        const dialogRef = this.dialog.open(ControlSchemeDeleteDialogComponent, {
            data: { name }
        });

        dialogRef.afterClosed().subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.delete({ id }));
            }
        });
    }
}
