import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { IoTypeToL10nKeyPipe } from '@app/shared';
import { VirtualPortConfigurationWithData } from '../../../store';

@Component({
    standalone: true,
    selector: 'app-hub-virtual-port-configuration-view',
    templateUrl: './hub-virtual-port-configuration-view.component.html',
    styleUrls: [ './hub-virtual-port-configuration-view.component.scss' ],
    imports: [
        MatExpansionModule,
        NgIf,
        MatIconModule,
        TranslocoModule,
        JsonPipe,
        IoTypeToL10nKeyPipe,
        MatFormFieldModule,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubVirtualPortConfigurationViewComponent {
    @Input() public data: VirtualPortConfigurationWithData | undefined;

    @Output() public readonly delete = new EventEmitter<void>();

    public get hasIssues(): boolean {
        if (!this.data) {
            return false;
        }
        return !this.data.ioA
            || !this.ioAMatches
            || !this.data.ioB
            || !this.ioBMatches;
    }

    public get ioAMatches(): boolean {
        if (!this.data) {
            return false;
        }
        return !!this.data.ioA
            && this.data.ioA.ioType === this.data.ioAExpectedType
            && this.data.ioA.hardwareRevision === this.data.ioAExpectedHardwareRevision
            && this.data.ioA.softwareRevision === this.data.ioAExpectedSoftwareRevision;
    }

    public get ioBMatches(): boolean {
        if (!this.data) {
            return false;
        }
        return !!this.data.ioB
            && this.data.ioB.ioType === this.data.ioBExpectedType
            && this.data.ioB.hardwareRevision === this.data.ioBExpectedHardwareRevision
            && this.data.ioB.softwareRevision === this.data.ioBExpectedSoftwareRevision;
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
