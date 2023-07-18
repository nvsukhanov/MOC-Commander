import { Directive, HostBinding, Inject } from '@angular/core';
import { WINDOW } from '@app/shared';
import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({
    standalone: true,
    selector: '[appTheming]'
})
export class ThemingDirective {
    @HostBinding('class.mat-typography') public readonly typography = true;

    @HostBinding('class.mat-app-background') public readonly background = true;

    @HostBinding('class.theme-dark') public useDarkTheme = false;

    constructor(
        @Inject(WINDOW) window: Window,
        overlayContainer: OverlayContainer
    ) {
        this.useDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        overlayContainer.getContainerElement().classList.add(this.useDarkTheme ? 'theme-dark' : 'theme-light');
    }
}
