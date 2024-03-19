import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

import { ROUTE_SECTIONS } from './routes';

@Injectable({ providedIn: 'root' })
export class RoutesBuilderService {
    public readonly controlSchemesList: string[];

    public readonly controlSchemesCreate: string[];

    public readonly hubsList: string[];

    public readonly controllersList: string[];

    public readonly about: string[];

    public readonly settings: string[];

    public readonly root: string[];

    public readonly help: string[];

    private readonly baseHref = this.locationStrategy.getBaseHref();

    constructor(
        private locationStrategy: LocationStrategy,
    ) {
        this.root = [ this.baseHref ];
        this.controlSchemesList = [ this.baseHref, ROUTE_SECTIONS.controlSchemes ];
        this.controlSchemesCreate = [ this.baseHref, ROUTE_SECTIONS.controlSchemes, ROUTE_SECTIONS.controlSchemeCreate ];
        this.hubsList = [ this.baseHref, ROUTE_SECTIONS.hubs ];
        this.controllersList = [ this.baseHref, ROUTE_SECTIONS.controllers ];
        this.about = [ this.baseHref, ROUTE_SECTIONS.about ];
        this.settings = [ this.baseHref, ROUTE_SECTIONS.settings ];
        this.help = [ this.baseHref, ROUTE_SECTIONS.help ];
    }

    public hubView(hubId: string): string[] {
        return [ this.baseHref, ROUTE_SECTIONS.hubs, hubId ];
    }

    public hubEdit(hubId: string): string[] {
        return [ this.baseHref, ROUTE_SECTIONS.hubs, hubId, ROUTE_SECTIONS.hubEdit ];
    }

    public controlSchemeView(schemeName: string): string[] {
        return [ this.baseHref, ROUTE_SECTIONS.controlSchemes, encodeURI(schemeName) ];
    }

    public bindingView(
        schemeName: string,
        bindingId: number
    ): string[] {
        return [
            this.baseHref,
            ROUTE_SECTIONS.controlSchemes,
            encodeURI(schemeName),
            ROUTE_SECTIONS.binding,
            bindingId.toString()
        ];
    }

    public bindingCreate(
        schemeName: string
    ): string[] {
        return [
            this.baseHref,
            ROUTE_SECTIONS.controlSchemes,
            encodeURI(schemeName),
            ROUTE_SECTIONS.bindingCreate
        ];
    }

    public portConfigEdit(
        schemeName: string,
        hubId: string,
        portId: number
    ): string[] {
        return [
            this.baseHref,
            ROUTE_SECTIONS.controlSchemes,
            encodeURI(schemeName),
            ROUTE_SECTIONS.hubEdit,
            hubId,
            ROUTE_SECTIONS.portEdit,
            portId.toString()
        ];
    }

    public controllerView(
        controllerId: string,
    ): string[] {
        return [
            this.baseHref,
            ROUTE_SECTIONS.controllers,
            encodeURI(controllerId)
        ];
    }

    public controlSchemeRename(
        schemeName: string
    ): string[] {
        return [
            this.baseHref,
            ROUTE_SECTIONS.controlSchemes,
            encodeURI(schemeName),
            ROUTE_SECTIONS.controlSchemeRename
        ];
    }
}
