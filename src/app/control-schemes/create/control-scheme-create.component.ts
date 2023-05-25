import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { BindingFormResult, ControlSchemeEditFormComponent } from '../edit';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS } from '../../store';
import { FeatureToolbarService } from '../../common';
import { RouterLink } from '@angular/router';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-create.component.html',
    styleUrls: [ './control-scheme-create.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
        PushModule,
        TranslocoModule,
        ControlSchemeEditFormComponent,
        RouterLink
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateComponent implements OnDestroy {
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

    public onSave(formResult: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.create(formResult));
    }
}
