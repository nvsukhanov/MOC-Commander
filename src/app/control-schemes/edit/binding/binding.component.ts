import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { IoOperationTypeToL10nKeyPipe } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { BindingEditAvailableOperationModesModel } from '../../control-schemes-feature.selectors';
import { RenderBindingDetailsEditDirective } from './render-binding-details-edit.directive';
import { BindingControlSelectHubComponent } from './control-select-hub';
import { BindingControlSelectOperationModeComponent } from './control-select-operation-mode';
import { BindingControlSelectIoComponent } from './control-select-io';

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
        BindingControlSelectOperationModeComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatButtonModule,
        RenderBindingDetailsEditDirective,
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
