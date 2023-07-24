import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

import { ROUTE_PATHS } from './routes';

@Injectable({ providedIn: 'root' })
export class RoutesBuilderService {
    public readonly controlSchemesList: string[];

    public readonly controlSchemesCreate: string[];

    public readonly hubsList: string[];

    public readonly controllersList: string[];

    public readonly about: string[];

    public readonly bluetoothUnavailable: string[];

    public readonly settings: string[];

    private readonly baseHref = this.locationStrategy.getBaseHref();

    constructor(
        private locationStrategy: LocationStrategy
    ) {
        this.controlSchemesList = [ this.baseHref, ROUTE_PATHS.controlSchemes ];
        this.controlSchemesCreate = [ this.baseHref, ROUTE_PATHS.controlSchemes, ROUTE_PATHS.controlSchemeCreate ];
        this.hubsList = [ this.baseHref, ROUTE_PATHS.hubs ];
        this.controllersList = [ this.baseHref, ROUTE_PATHS.controllers ];
        this.about = [ this.baseHref, ROUTE_PATHS.about ];
        this.bluetoothUnavailable = [ this.baseHref, ROUTE_PATHS.bluetoothUnavailable ];
        this.settings = [ this.baseHref, ROUTE_PATHS.settings ];
    }

    public hubView(hubId: string): string[] {
        return [ this.baseHref, ROUTE_PATHS.hubs, hubId ];
    }

    public hubEdit(hubId: string): string[] {
        return [ this.baseHref, ROUTE_PATHS.hubs, hubId, ROUTE_PATHS.hubEdit ];
    }

    public controlSchemeView(controlSchemeId: string): string[] {
        return [ this.baseHref, ROUTE_PATHS.controlSchemes, controlSchemeId ];
    }

    public controlSchemeEdit(controlSchemeId: string): string[] {
        return [ this.baseHref, ROUTE_PATHS.controlSchemes, controlSchemeId, ROUTE_PATHS.controlSchemeEdit ];
    }
}
