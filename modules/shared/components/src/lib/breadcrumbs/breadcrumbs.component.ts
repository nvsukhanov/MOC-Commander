import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

import { EllipsisTitleDirective } from '../ellipsis-title.directive';
import { BreadcrumbsStateService } from './breadcrumbs-state.service';

@Component({
  standalone: true,
  selector: 'lib-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  imports: [RouterLink, EllipsisTitleDirective, MatIcon, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  constructor(protected readonly breadcrumbsStateService: BreadcrumbsStateService) {}
}
