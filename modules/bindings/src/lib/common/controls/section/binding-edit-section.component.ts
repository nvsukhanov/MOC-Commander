import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenSizeObserverService } from '@app/shared-misc';

@Component({
  standalone: true,
  selector: 'lib-cs-binding-edit-section',
  templateUrl: './binding-edit-section.component.html',
  styleUrl: './binding-edit-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingEditSectionComponent implements OnInit, OnDestroy {
  @Input() public caption?: string;

  @Input() public smallScreenWidthPercentage = 100;

  @Input() public largeScreenWidthPercentage = 100;

  @HostBinding('style.flex-basis.%') public flexBasisPercentage = 100;

  @HostBinding('style.margin-bottom.px') public marginBottom = 0;

  private screenSizeSubscription?: Subscription;

  private readonly largeScreenMarginBottom = 0;

  private readonly smallScreenMarginBottom = 20;

  constructor(private readonly screenSizeObserver: ScreenSizeObserverService) {}

  public ngOnInit(): void {
    this.screenSizeSubscription = this.screenSizeObserver.isSmallScreen$.subscribe((isSmallScreen) => {
      this.flexBasisPercentage = isSmallScreen ? this.smallScreenWidthPercentage : this.largeScreenWidthPercentage;
      this.marginBottom = isSmallScreen ? this.smallScreenMarginBottom : this.largeScreenMarginBottom;
    });
  }

  public ngOnDestroy(): void {
    this.screenSizeSubscription?.unsubscribe();
  }
}
