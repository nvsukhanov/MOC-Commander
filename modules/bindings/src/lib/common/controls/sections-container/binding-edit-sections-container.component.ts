import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ScreenSizeObserverService } from '@app/shared-misc';

@Component({
  standalone: true,
  selector: 'lib-cs-binding-edit-sections-container',
  templateUrl: './binding-edit-sections-container.component.html',
  styleUrl: './binding-edit-sections-container.component.scss',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingEditSectionsContainerComponent {
  public readonly useColumn$: Observable<boolean>;

  constructor(private readonly screenSizeObserverService: ScreenSizeObserverService) {
    this.useColumn$ = this.screenSizeObserverService.isSmallScreen$;
  }
}
