import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/overlay';
import { CONTROLLERS_ACTIONS } from '@app/store';
import { FeatureToolbarComponent, IScrollContainer, SCROLL_CONTAINER, ScreenSizeObserverService } from '@app/shared';

import { ROOT_SELECTORS } from '../root.selectors';
import { NavMenuComponent } from '../nav-menu';

@Component({
    standalone: true,
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.scss' ],
    imports: [
        PushPipe,
        LetDirective,
        RouterOutlet,
        NgIf,
        MatProgressBarModule,
        FeatureToolbarComponent,
        NavMenuComponent,
        CdkScrollable,
    ],
    providers: [
        { provide: SCROLL_CONTAINER, useExisting: LayoutComponent }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit, OnDestroy, IScrollContainer {
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
