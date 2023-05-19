import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ROUTE_PATHS } from '../../routes';
import { RouterLink } from '@angular/router';
import { EllipsisTitleDirective } from '../../common';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list-item',
    templateUrl: './control-scheme-list-item.component.html',
    styleUrls: [ './control-scheme-list-item.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatLineModule,
        NgIf,
        TranslocoModule,
        RouterLink,
        EllipsisTitleDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListItemComponent {
    @Input() public name = '';

    @Input() public isActive = false;

    @Output() public readonly delete = new EventEmitter<void>();

    @Input() public canStartScheme = false;

    private _schemeViewHref: string[] = [];

    private _schemeEditHref: string[] = [];

    @Input()
    public set schemeId(value: string | undefined) {
        this._schemeViewHref = value ? [ '..', ROUTE_PATHS.controlScheme, value ] : [];
        this._schemeEditHref = value ? [ '..', ROUTE_PATHS.controlScheme, value, ROUTE_PATHS.controlSchemeEditSubroute ] : [];
    }

    public get schemeViewHref(): string[] {
        return this._schemeViewHref;
    }

    public get schemeEditHref(): string[] {
        return this._schemeEditHref;
    }

    public onDeleteClick(): void {
        this.delete.emit();
    }
}
