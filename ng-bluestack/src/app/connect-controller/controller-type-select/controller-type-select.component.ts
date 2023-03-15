import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControllerType } from '../../types';
import { Observable } from 'rxjs';
import { L10nPipe, L10nService } from '../../l10n';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, KeyValuePipe, NgForOf } from '@angular/common';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings/controller-type-to-l10n';

@Component({
    standalone: true,
    selector: 'app-controller-type-select',
    templateUrl: './controller-type-select.component.html',
    imports: [
        MatSelectModule,
        KeyValuePipe,
        NgForOf,
        AsyncPipe,
        L10nPipe
    ],
    styleUrls: [ './controller-type-select.component.scss' ]
})
export class ControllerTypeSelectComponent {
    @Input() public controllerType = ControllerType.Unassigned;
    @Output() public readonly controllerTypeChange = new EventEmitter<ControllerType>();

    public readonly controllerTypes = MAPPING_CONTROLLER_TO_L10N;

    constructor(
        public readonly l10nService: L10nService
    ) {
    }

    public onControllerTypeChange(type: ControllerType): void {
        this.controllerTypeChange.emit(type);
    }
}
