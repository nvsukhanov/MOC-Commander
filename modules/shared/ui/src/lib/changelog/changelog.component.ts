import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDivider } from '@angular/material/divider';

import { CHANGELOG } from './changelog';

@Component({
    standalone: true,
    selector: 'lib-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: [ './changelog.component.scss' ],
    imports: [
        TranslocoPipe,
        MatDivider
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangelogComponent {
    public readonly log = CHANGELOG;
}
