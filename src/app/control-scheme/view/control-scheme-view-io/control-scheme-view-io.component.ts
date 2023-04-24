import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlSchemeBinding, IOBindingValidationResults } from '../../../store';
import { PortCommandTask } from '../../task-composer';
import { JsonPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view-io',
    templateUrl: './control-scheme-view-io.component.html',
    styleUrls: [ './control-scheme-view-io.component.scss' ],
    imports: [
        NgIf,
        JsonPipe,
        MatCardModule,
        TranslocoModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewIoComponent {
    @Input() public binding?: ControlSchemeBinding;

    @Input() public lastExecutedTask?: PortCommandTask;

    @Input() public validation?: IOBindingValidationResults;
}
