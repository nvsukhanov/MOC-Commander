import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subscription, switchMap, take } from 'rxjs';

@Injectable()
export class TitleService implements OnDestroy {
  private sub?: Subscription;

  constructor(
    private readonly title: Title,
    private readonly transloco: TranslocoService,
  ) {}

  public setTitle$(title$: Observable<string | null>): void {
    this.sub?.unsubscribe();
    this.sub = title$
      .pipe(
        switchMap((pageTitle) => {
          if (pageTitle) {
            return this.transloco.selectTranslate('appName').pipe(
              switchMap((appName) => {
                return this.transloco.selectTranslate('appTitleTemplate', { appName, pageTitle });
              }),
            );
          } else {
            return this.transloco.selectTranslate('appName');
          }
        }),
      )
      .subscribe((fullTitle) => {
        this.title.setTitle(fullTitle);
      });
  }

  public ngOnDestroy(): void {
    this.transloco
      .selectTranslate('appName')
      .pipe(take(1))
      .subscribe((appName) => {
        this.title.setTitle(appName);
      });
    this.sub?.unsubscribe();
  }
}
