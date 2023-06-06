import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { EllipsisTitleDirective } from '../../../../common';

@Component({
    standalone: true,
    selector: 'app-output-no-configuration',
    templateUrl: './output-no-configuration.component.html',
    styleUrls: [ './output-no-configuration.component.scss' ],
    imports: [
        TranslocoModule,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputNoConfigurationComponent implements IOutputConfigurationRenderer {
}
