import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FeatureToolbarComponent } from '@app/shared-ui';
import { IScrollContainer, ScreenSizeObserverService } from '@app/shared-misc';
import { CONTROLLERS_ACTIONS } from '@app/store';

import { NavMenuComponent } from './nav-menu';
import { ROOT_SELECTORS } from './root.selectors';

@Component({
    standalone: true,
    selector: 'feat-root',
    templateUrl: './root.component.html',
    styleUrls: [ './root.component.scss' ],
    imports: [
        CdkScrollable,
        FeatureToolbarComponent,
        MatProgressBarModule,
        NavMenuComponent,
        NgIf,
        PushPipe,
        RouterOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit, OnDestroy, IScrollContainer {
    @ViewChild(CdkScrollable, { static: true }) public scrollable!: CdkScrollable;

    public readonly shouldShowProgressBar$ = this.store.select(ROOT_SELECTORS.shouldShowProgressBar);

    private _isSmallScreen = false;

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly cd: ChangeDetectorRef
    ) {
    }

    @HostBinding('class.is-small-screen')
    public get isSmallScreen(): boolean {
        return this._isSmallScreen;
    }

    public ngOnInit(): void {
        this.sub = this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            this._isSmallScreen = isSmallScreen;
            this.cd.markForCheck();
        });
        this.store.dispatch(CONTROLLERS_ACTIONS.waitForConnect());
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    public scrollToBottom(): void {
        this.scrollable.scrollTo({ bottom: 0 });
    }
}
