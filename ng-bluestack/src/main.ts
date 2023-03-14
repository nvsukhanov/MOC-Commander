import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
    ]
});
