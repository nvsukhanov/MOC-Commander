import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatCard, MatCardContent } from '@angular/material/card';

import { RunBlockerL10nPipe } from './run-blocker-l10n.pipe';
import { SchemeRunBlocker } from './scheme-run-blocker';

@Component({
  standalone: true,
  selector: 'page-control-scheme-view-run-blockers-list',
  templateUrl: './run-blockers-list.component.html',
  styleUrl: './run-blockers-list.component.scss',
  imports: [RunBlockerL10nPipe, MatIcon, TranslocoPipe, MatCard, MatCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunBlockersListComponent {
  @Input() public runBlockers: readonly SchemeRunBlocker[] | null = null;
}
