import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { FormArray } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { PushPipe } from '@ngrx/component';

import { VirtualPortsForm } from '../types';
import { EllipsisTitleDirective, HubIdToNamePipe, IoTypeToL10nKeyPipe } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-virtual-ports-list',
    templateUrl: './virtual-ports-list.component.html',
    styleUrls: [ './virtual-ports-list.component.scss' ],
    imports: [
        MatCardModule,
        TranslocoModule,
        JsonPipe,
        NgIf,
        MatListModule,
        NgForOf,
        IoTypeToL10nKeyPipe,
        MatButtonModule,
        HubIdToNamePipe,
        PushPipe,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualPortsListComponent {
    @Output() public readonly delete = new EventEmitter<number>();

    private _rawVirtualPorts: Array<ReturnType<VirtualPortsForm['getRawValue']>> = [];

    @Input()
    public set virtualPorts(
        v: FormArray<VirtualPortsForm> | undefined
    ) {
        this._rawVirtualPorts = v?.getRawValue() ?? [];
    }

    public get rawVirtualPorts(): Array<ReturnType<VirtualPortsForm['getRawValue']>> {
        return this._rawVirtualPorts;
    }

    public trackVirtualPortFn(
        _: number,
        virtualPort: ReturnType<VirtualPortsForm['getRawValue']>
    ): string {
        return `${virtualPort.hubId}/${virtualPort.portIdA}/${virtualPort.portIdB}`;
    }

    public onDelete(
        index: number
    ): void {
        this.delete.emit(index);
    }
}
