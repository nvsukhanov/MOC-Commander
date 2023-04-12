import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HubConfiguration } from '../../store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-hub-properties-view',
    templateUrl: './hub-properties-view.component.html',
    styleUrls: [ './hub-properties-view.component.scss' ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        NgIf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPropertiesViewComponent {
    @Input() public hub: HubConfiguration | undefined;

    @Output() public readonly disconnect = new EventEmitter<void>();

    public onDisconnect(): void {
        this.disconnect.emit();
    }
}
