import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeatureToolbarService {
  public readonly controlsTemplate$: Observable<TemplateRef<unknown> | null>;

  private _controlsTemplate = new BehaviorSubject<TemplateRef<unknown> | null>(null);

  constructor() {
    this.controlsTemplate$ = this._controlsTemplate;
  }

  public setControls(controlsTemplate: TemplateRef<unknown>): void {
    this._controlsTemplate.next(controlsTemplate);
  }

  public clearConfig(): void {
    this._controlsTemplate.next(null);
  }
}
