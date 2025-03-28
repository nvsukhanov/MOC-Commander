import { AfterViewInit, Directive, ElementRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { WindowResizeTrackerService } from '@app/shared-misc';

@Directive({
  standalone: true,
  selector: '[libEllipsisTitle]',
})
export class EllipsisTitleDirective implements AfterViewInit, OnDestroy {
  @HostBinding('style.overflow') public overflow = 'hidden';

  @HostBinding('style.white-space') public whiteSpace = 'nowrap';

  @HostBinding('style.text-overflow') public textOverflow = 'ellipsis';

  private readonly recalculationScheduler = new Subject<void>();

  private recalculationSubscription?: Subscription;

  private resizeTrackerSubscription?: Subscription;

  private observer?: MutationObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly windowResizeTracker: WindowResizeTrackerService,
  ) {}

  public ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => this.recalculationScheduler.next());
    this.observer.observe(this.elementRef.nativeElement, { childList: true, subtree: true });

    this.resizeTrackerSubscription = this.windowResizeTracker.resize$.subscribe(() => {
      this.recalculationScheduler.next();
    });

    this.recalculationSubscription = this.recalculationScheduler.pipe(debounceTime(1000)).subscribe(() => this.recalculateTitle());
    this.recalculateTitle();
  }

  public ngOnDestroy(): void {
    this.recalculationSubscription?.unsubscribe();
    this.resizeTrackerSubscription?.unsubscribe();
    this.observer?.disconnect();
  }

  private recalculateTitle(): void {
    const element = this.elementRef.nativeElement;
    if (element.offsetWidth < element.scrollWidth) {
      this.renderer.setAttribute(element, 'title', this.getExpectedTitle());
    }
  }

  private getExpectedTitle(): string {
    return (this.elementRef.nativeElement.textContent ?? '').trim();
  }
}
