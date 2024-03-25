import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Subscription, animationFrameScheduler, interval, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { FeatureToolbarComponent } from '@app/shared-components';
import { IScrollContainer, ScreenSizeObserverService } from '@app/shared-misc';
import { COMMON_ACTIONS, CONTROLLERS_ACTIONS } from '@app/store';

import { NavMenuComponent } from './nav-menu';
import { ROOT_SELECTORS } from './root.selectors';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: [ './root.component.scss' ],
    imports: [
        CdkScrollable,
        FeatureToolbarComponent,
        MatProgressBarModule,
        NavMenuComponent,
        RouterOutlet,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit, OnDestroy, IScrollContainer, AfterViewInit {
    @ViewChild(CdkScrollable, { static: true }) public scrollable!: CdkScrollable;

    public readonly shouldShowProgressBar$ = this.store.select(ROOT_SELECTORS.shouldShowProgressBar);

    private _isSmallScreen = false;

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly cd: ChangeDetectorRef,
        private readonly zone: NgZone
    ) {
    }

    @HostBinding('class.is-small-screen')
    public get isSmallScreen(): boolean {
        return this._isSmallScreen;
    }

    @HostListener('dragstart', [ '$event' ])
    public onDragStart(event: DragEvent): void {
        event.preventDefault();
    }

    public ngOnInit(): void {
        this.sub = this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            this._isSmallScreen = isSmallScreen;
            this.cd.markForCheck();
        });
        this.store.dispatch(CONTROLLERS_ACTIONS.waitForConnect());
    }

    public ngAfterViewInit(): void {
        // MatSnackBar cannot show notifications early in the app lifecycle, so have to we wait for the 'app to be ready'.
        // This workaround IMO is just a bit better than using a setTimeout.
        interval(40, animationFrameScheduler).pipe(
            switchMap(() => this.zone.onMicrotaskEmpty),
            take(1)
        ).subscribe(() => {
            this.store.dispatch(COMMON_ACTIONS.appReady());
        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    public scrollToBottom(): void {
        this.scrollable.scrollTo({ bottom: 0 });
    }
}
