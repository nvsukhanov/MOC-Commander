import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BindingForm } from '../types';
import { RenderEditOutputConfigurationDirective } from '../edit-output-configuration';
import { TranslocoModule } from '@ngneat/transloco';
import { NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-configuration',
    templateUrl: './control-scheme-binding-configuration.component.html',
    styleUrls: [ './control-scheme-binding-configuration.component.scss' ],
    imports: [
        RenderEditOutputConfigurationDirective,
        TranslocoModule,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingConfigurationComponent {
    @Input() public formGroup: BindingForm | undefined = undefined;
}
