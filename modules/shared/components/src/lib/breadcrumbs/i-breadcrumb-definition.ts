import { Observable } from 'rxjs';

export interface IBreadcrumbDefinition {
  readonly label$: Observable<string>;
  readonly route: string[];
}
