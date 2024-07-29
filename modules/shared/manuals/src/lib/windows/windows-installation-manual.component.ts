import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';
import { NgOptimizedImage } from '@angular/common';

import { COMMON_RESOURCES } from '../common-resources';

@Component({
    standalone: true,
    selector: 'lib-windows-installation-manual',
    templateUrl: './windows-installation-manual.component.html',
    styleUrls: [ '../common-styles.scss' ],
    imports: [
        TranslocoDirective,
        MatDivider,
        NgOptimizedImage
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowsInstallationManualComponent {
    protected readonly resources = COMMON_RESOURCES;
}
