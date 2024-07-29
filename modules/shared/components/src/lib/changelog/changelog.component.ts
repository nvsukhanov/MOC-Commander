import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';

import { CHANGELOG_TOKEN, IChangelog } from './i-changelog';

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
    constructor(
        @Inject(CHANGELOG_TOKEN) public readonly changelog: IChangelog
    ) {
    }
}
