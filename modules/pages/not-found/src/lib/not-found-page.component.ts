import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TitleService } from '@app/shared-misc';
import { HintComponent } from '@app/shared-components';

@Component({
  standalone: true,
  selector: 'page-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  imports: [TranslocoPipe, HintComponent],
  providers: [TitleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent implements OnInit {
  constructor(
    private readonly titleService: TitleService,
    private readonly translocoService: TranslocoService,
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.notFound'));
  }
}
