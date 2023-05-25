import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { LetModule, PushModule } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS, CONTROL_SCHEME_SELECTORS, ControlScheme } from '../../store';
import { ControlSchemeListItemComponent } from '../control-scheme-list-item';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FeatureToolbarService } from '../../common';
import { MatCardModule } from '@angular/material/card';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list',
    templateUrl: './control-scheme-list.component.html',
    styleUrls: [ './control-scheme-list.component.scss' ],
    imports: [
        LetModule,
        NgForOf,
        NgIf,
        PushModule,
        TranslocoModule,
        ControlSchemeListItemComponent,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListComponent implements OnDestroy {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemesList);

    public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    constructor(
        private readonly store: Store,
        private readonly featureToolbarService: FeatureToolbarService,
        protected readonly routesBuilderService: RoutesBuilderService
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

    public trackSchemeById(index: number, scheme: ControlScheme): string {
        return scheme.id;
    }

    public onDelete(id: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.delete({ id }));
    }
}
