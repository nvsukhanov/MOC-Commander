import { Directive, HostBinding, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SETTINGS_FEATURE, UserSelectedTheme } from '@app/store';

enum AppTheme {
    Light,
    Dark
}

@Directive({
    standalone: true,
    selector: '[featRootTheming]'
})
export class ThemingDirective implements OnInit, OnDestroy {
    @HostBinding('class.mat-typography') public readonly typography = true;

    @HostBinding('class.mat-app-background') public readonly background = true;

    private readonly sub: Subscription = new Subscription();

    private readonly themeClassNames: { [s in AppTheme]: string } = {
        [AppTheme.Light]: 'theme-light',
        [AppTheme.Dark]: 'theme-dark'
    };

    private currentTheme?: AppTheme;

    constructor(
        private readonly overlayContainer: OverlayContainer,
        private readonly store: Store,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly renderer: Renderer2
    ) {
    }

    public ngOnInit(): void {
        // eslint-disable-next-line @ngrx/no-store-subscription
        this.sub.add(this.store.select(SETTINGS_FEATURE.selectAppTheme).subscribe((theme) => {
            const nextTheme = this.mapUserSelectedThemeToAppTheme(theme);
            if (this.currentTheme !== nextTheme) {
                this.applyTheme(nextTheme);
            }
        }));
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private applyTheme(
        nextTheme: AppTheme
    ): void {
        const currentTheme = this.currentTheme;
        if (currentTheme !== undefined) {
            this.renderer.removeClass(this.viewContainerRef.element.nativeElement, this.themeClassNames[currentTheme]);
            this.renderer.removeClass(this.overlayContainer.getContainerElement(), this.themeClassNames[currentTheme]);
        }
        this.currentTheme = nextTheme;
        const themeName = this.themeClassNames[nextTheme];
        this.renderer.addClass(this.viewContainerRef.element.nativeElement, themeName);
        this.renderer.addClass(this.overlayContainer.getContainerElement(), themeName);
    }

    private mapUserSelectedThemeToAppTheme(
        theme: UserSelectedTheme
    ): AppTheme {
        switch (theme) {
            case UserSelectedTheme.Light:
                return AppTheme.Light;
            case UserSelectedTheme.Dark:
                return AppTheme.Dark;
            case UserSelectedTheme.System:
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? AppTheme.Dark : AppTheme.Light;
        }
    }
}
