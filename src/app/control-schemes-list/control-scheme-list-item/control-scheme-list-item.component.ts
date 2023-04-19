import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { CONTROL_SCHEME_ROUTE } from '../../routes';
import { RouterLink } from '@angular/router';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListItemComponent {
    @Input() public name = '';

    @Input() public isActive = false;

    @Output() public readonly delete = new EventEmitter<void>();

    private _schemeViewHref: string[] = [];

    @Input()
    public set schemeId(value: string | undefined) {
        this._schemeViewHref = value ? [ CONTROL_SCHEME_ROUTE, value ] : [];
    }

    public get schemeViewHref(): string[] {
        return this._schemeViewHref;
    }

    public onDeleteClick(): void {
        this.delete.emit();
    }
}
