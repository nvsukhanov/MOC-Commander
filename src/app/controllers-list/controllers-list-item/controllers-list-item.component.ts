import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControllerType } from '../../store';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings';

@Component({
    standalone: true,
    selector: 'app-controllers-list-item',
    templateUrl: './controllers-list-item.component.html',
    styleUrls: [ './controllers-list-item.component.scss' ],
    imports: [
        NgIf,
        MatButtonModule,
        TranslocoModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListItemComponent {
    @Input() public name?: string;

    @Input() public type?: ControllerType;

    @Output() public readonly disconnect = new EventEmitter<void>();

    public readonly controllerTypeMap = MAPPING_CONTROLLER_TO_L10N;

    public disconnectController(): void {
        this.disconnect.emit();
    }
}
