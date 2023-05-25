import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme, ROUTER_SELECTORS } from '../../store';
import { map, Observable, of, Subscription, switchMap } from 'rxjs';
import { BindingFormResult, ControlSchemeEditFormComponent } from './edit-form';
import { TranslocoModule } from '@ngneat/transloco';
import { JsonPipe, NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FeatureToolbarService } from '../../common';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-edit.component.html',
    styleUrls: [ './control-scheme-edit.component.scss' ],
    imports: [
        ControlSchemeEditFormComponent,
        TranslocoModule,
        NgIf,
        PushModule,
        JsonPipe,
        MatButtonModule,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditComponent implements OnDestroy {
    public readonly currentlyEditedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        switchMap((i) => i === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(i)))
    );

    public readonly isSchemeRunning$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        switchMap((i) => i === null ? of(false) : this.store.select(CONTROL_SCHEME_SELECTORS.isSchemeRunning(i)))
    );

    public readonly cancelViewUrl$: Observable<string[]> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        map((i) => i !== null ? this.routesBuilderService.controlSchemeView(i) : [])
    );

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly featureToolbarService: FeatureToolbarService,
        private readonly routesBuilderService: RoutesBuilderService
    ) {
    }

    @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        this.sub?.unsubscribe();
        if (!controls) {
            return;
        }
        this.sub = this.currentlyEditedScheme$.subscribe((scheme) => {
            if (scheme) {
                this.featureToolbarService.setControls(controls);
            } else {
                this.featureToolbarService.clearConfig();
            }
        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.featureToolbarService.clearConfig();
    }

    public onSave(data: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.update(data));
    }
}
