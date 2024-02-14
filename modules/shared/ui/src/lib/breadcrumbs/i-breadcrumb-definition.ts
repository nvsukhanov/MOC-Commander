import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IBreadcrumbDefinition {
    readonly label$: Observable<string>;
    readonly route: string[];
}

export const BREADCRUMB_DEFINITION = new InjectionToken<IBreadcrumbDefinition[]>('BREADCRUMB_DEFINITION');
