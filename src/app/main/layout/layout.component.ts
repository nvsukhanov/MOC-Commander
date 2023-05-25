import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GAMEPAD_ACTIONS, GLOBAL_PROGRESS_BAR_SELECTORS } from '../../store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FeatureToolbarComponent, ScreenSizeObserverService } from '../../common';
import { Observable } from 'rxjs';
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
export class LayoutComponent implements OnInit {
    public readonly shouldShowProgressBar$ = this.store.select(GLOBAL_PROGRESS_BAR_SELECTORS.shouldShowProgressBar);

    @HostBinding('class.isSmallScreen') public readonly isSmallScreen$: Observable<boolean> = this.screenSizeObserverService.isSmallScreen$;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }

    public ngOnInit(): void {
        this.store.dispatch(GAMEPAD_ACTIONS.listenGamepadConnected());
    }
}
