import { ChangeDetectorRef, Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ScreenSizeObserverService } from '../screen-size-observer.service';

@Directive({
    standalone: true,
    selector: '[appHideOnSmallScreen]'
})
export class HideOnSmallScreenDirective implements OnInit, OnDestroy {
    private subscription?: Subscription;

    constructor(
        private readonly templateRef: TemplateRef<unknown>,
        private readonly viewContainer: ViewContainerRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
        this.viewContainer.clear();
        this.subscription = this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            if (isSmallScreen) {
                this.viewContainer.clear();
                this.cdRef.markForCheck();
            } else {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.cdRef.markForCheck();
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
