import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONTROLLERS_ACTIONS, GLOBAL_PROGRESS_BAR_SELECTORS } from '../../store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FeatureToolbarComponent, ScreenSizeObserverService } from '../../common';
import { Subscription } from 'rxjs';
import { NavMenuComponent } from '../nav-menu';

@Component({
    standalone: true,
    selector: 'app-root',
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit, OnDestroy {
    public readonly shouldShowProgressBar$ = this.store.select(GLOBAL_PROGRESS_BAR_SELECTORS.shouldShowProgressBar);

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
}
