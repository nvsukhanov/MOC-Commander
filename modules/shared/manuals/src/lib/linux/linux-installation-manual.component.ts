import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';
import { CodeBlockComponent } from '@app/shared-components';

import { COMMON_RESOURCES } from '../common-resources';

@Component({
    standalone: true,
    selector: 'lib-linux-installation-manual',
    templateUrl: './linux-installation-manual.component.html',
    styleUrl: '../common-styles.scss',
    imports: [
        TranslocoDirective,
        MatDivider,
        CodeBlockComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinuxInstallationManualComponent {
    protected readonly resources = COMMON_RESOURCES;
}
