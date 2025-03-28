import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class I18nLoaderService implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  public getTranslation(lang: string): Observable<Translation> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}
