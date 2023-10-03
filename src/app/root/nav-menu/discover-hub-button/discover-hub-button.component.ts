import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Subscription, interval, take } from 'rxjs';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { RoutesBuilderService } from '@app/routing';

@Component({
    standalone: true,
    selector: 'app-discover-hub-button',
    templateUrl: './discover-hub-button.component.html',
    styleUrls: [ './discover-hub-button.component.scss' ],
    imports: [
        NgIf,
        MatButtonModule,
        TranslocoPipe,
        MatIconModule,
        RouterLink,
        PushPipe,
        MatRippleModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverHubButtonComponent implements OnInit, OnDestroy {
    @Input() public isBluetoothAvailable = false;

    @Input() public isDiscoveryBusy = false;

    @Input() public connectedHubsCount = 0;

    @Output() public readonly discoveryStart = new EventEmitter<void>();

    @ViewChild('discoverHubRipples', { static: false, read: MatRipple }) public readonly discoverHubRipples?: MatRipple;

    private readonly ripplesInterval = 2000;

    private readonly ripplesCount = 3;

    private rippleSub?: Subscription;

    constructor(
        public readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    public onDiscoveryStart(): void {
        this.discoveryStart.next();
    }

    public ngOnInit(): void {
        const shouldShowRipple = this.isBluetoothAvailable && !this.isDiscoveryBusy && this.connectedHubsCount === 0;
        if (shouldShowRipple) {
            this.rippleSub = interval(this.ripplesInterval).pipe(
                take(this.ripplesCount)
            ).subscribe(() => {
                this.discoverHubRipples?.launch({
                    persistent: false,
                    centered: true,
                });
            });
        }
    }

    public ngOnDestroy(): void {
        this.rippleSub?.unsubscribe();
    }
}
