import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IBreadcrumbDefinition } from './i-breadcrumb-definition';

@Injectable({ providedIn: 'root' })
export class BreadcrumbsStateService {
  public readonly breadcrumbsDef$: Observable<ReadonlyArray<IBreadcrumbDefinition>>;

  private _breadcrumbsDef = new BehaviorSubject<ReadonlyArray<IBreadcrumbDefinition>>([]);

  constructor() {
    this.breadcrumbsDef$ = this._breadcrumbsDef;
  }

  public setBreadcrumbsDef(pathDefinitions: ReadonlyArray<IBreadcrumbDefinition>): void {
    this._breadcrumbsDef.next(pathDefinitions);
  }

  public clearBreadcrumbs(): void {
    this._breadcrumbsDef.next([]);
  }
}
