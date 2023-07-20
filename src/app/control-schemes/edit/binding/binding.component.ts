import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { IoOperationTypeToL10nKeyPipe } from '@app/shared';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';

import { ControlSchemeBindingForm } from '../types';
import { BindingEditAvailableOperationModesModel } from '../../control-schemes-feature.selectors';
import { OperationModeSelectComponent } from './operation-mode-select';
import { HubSelectComponent } from './hub-select';
import { IoSelectComponent } from './io-select';
import { RenderBindingSpecificsDirective } from './render-binding-specifics.directive';

@Component({
    standalone: true,
    selector: 'app-binding',
    templateUrl: './binding.component.html',
    styleUrls: [ './binding.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        IoOperationTypeToL10nKeyPipe,
        TranslocoModule,
        NgForOf,
        OperationModeSelectComponent,
        HubSelectComponent,
        IoSelectComponent,
        MatButtonModule,
        RenderBindingSpecificsDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingComponent {
    @Input() public binding?: ControlSchemeBindingForm;

    @Input() public availabilityData: BindingEditAvailableOperationModesModel = {};

    @Output() public deleteBinding = new EventEmitter<void>();

    public onDelete(): void {
        this.deleteBinding.emit();
    }
}
