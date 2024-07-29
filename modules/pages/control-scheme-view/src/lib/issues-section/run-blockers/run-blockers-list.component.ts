import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatCard, MatCardContent } from '@angular/material/card';

import { RunBlockerL10nPipe } from './run-blocker-l10n.pipe';
import { SchemeRunBlocker } from './scheme-run-blocker';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-run-blockers-list',
    templateUrl: './run-blockers-list.component.html',
    styleUrls: [ './run-blockers-list.component.scss' ],
    imports: [
        AsyncPipe,
        RunBlockerL10nPipe,
        MatDivider,
        MatIcon,
        TranslocoPipe,
        MatCard,
        MatCardContent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunBlockersListComponent {
    @Input() public runBlockers: readonly SchemeRunBlocker[] | null = null;
}
