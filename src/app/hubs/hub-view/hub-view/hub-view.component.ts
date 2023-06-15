/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EMPTY, Observable, map, merge, switchMap, take, tap } from 'rxjs';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { ConfirmDialogService, NotFoundComponent } from '@app/shared';
import { HubPropertiesViewComponent } from '../hub-properties-view';
import { HubIoViewComponent } from '../hub-io-view';
import {
    HUBS_ACTIONS,
    HUBS_SELECTORS,
    HUB_ATTACHED_IO_SELECTORS,
    HubConfiguration,
    IOFullInfo,
    ROUTER_SELECTORS,
    VIRTUAL_PORTS_ACTIONS,
    VirtualPortConfigurationWithData,
    hubAttachedIosIdFn,
    hubVirtualPortConfigIdFn
} from '../../../store';
import { RoutesBuilderService } from '../../../routing';
import { CreateVirtualPortConfigurationDialogComponent, CreateVirtualPortDialogResult } from '../../create-virtual-port-dialog';
import { HubVirtualPortConfigurationViewComponent } from '../hub-virtual-port-configuration-view/hub-virtual-port-configuration-view.component';

@Component({
    standalone: true,
    selector: 'app-hub-view',
    templateUrl: './hub-view.component.html',
    styleUrls: [ './hub-view.component.scss' ],
    imports: [
        PushPipe,
        LetDirective,
        MatButtonModule,
        NgIf,
        NgForOf,
        MatDividerModule,
        TranslocoModule,
        HubPropertiesViewComponent,
        HubIoViewComponent,
        NotFoundComponent,
        JsonPipe,
        MatDialogModule,
        HubVirtualPortConfigurationViewComponent,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewComponent implements OnDestroy {
    public readonly selectedHub$: Observable<HubConfiguration | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUBS_SELECTORS.selectHub(id)))
    );

    public readonly virtualPortsData$: Observable<ReadonlyArray<VirtualPortConfigurationWithData>> =
        this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
            switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_ATTACHED_IO_SELECTORS.selectVirtualPortsWithIOData(id)))
        );

    public readonly IOFullData$: Observable<IOFullInfo[]> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_ATTACHED_IO_SELECTORS.selectFullIOsInfo(id)))
    );

    public synchronizableMergeableIOsCount$: Observable<number> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_ATTACHED_IO_SELECTORS.countSynchronizableMergeableIOsCount(id)))
    );

    constructor(
        private readonly store: Store,
        private readonly router: Router,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly dialog: MatDialog,
        private readonly confirmDialogService: ConfirmDialogService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public disconnectHub(): void {
        this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
            take(1)
        ).subscribe((id) => {
            if (id === undefined) {
                return;
            }
            this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId: id }));
        });
        this.router.navigate(this.routesBuilderService.hubsList);
    }

    public createVirtualPortConfiguration(
        hubId: string,
        portIdA: number,
    ): void {
        this.store.select(HUB_ATTACHED_IO_SELECTORS.selectMergeableIOs({ hubId })).pipe(
            take(1),
            switchMap((mergeableIOS) => {
                const dialogRef = this.dialog.open(CreateVirtualPortConfigurationDialogComponent, {
                    data: {
                        hubId,
                        portIdA,
                        mergeableIOs: mergeableIOS
                    }
                });
                return merge(
                    dialogRef.afterClosed().pipe(map(() => undefined)),
                    dialogRef.componentInstance.createVirtualPortConfiguration.pipe(
                        tap((data: CreateVirtualPortDialogResult) => dialogRef.close(data))
                    )
                );
            }),
            take(1)
        ).subscribe((data: CreateVirtualPortDialogResult | undefined) => {
            if (data) {
                this.store.dispatch(VIRTUAL_PORTS_ACTIONS.createVirtualPort({
                    hubId,
                    name: data.name,
                    portIdA: data.portIdA,
                    ioAType: data.ioAType,
                    ioAHardwareRevision: data.ioAHardwareRevision,
                    ioASoftwareRevision: data.ioASoftwareRevision,
                    portIdB: data.portIdB,
                    ioBType: data.ioBType,
                    ioBHardwareRevision: data.ioBHardwareRevision,
                    ioBSoftwareRevision: data.ioBSoftwareRevision
                }));
            }
        });
    }

    public hubIoTrackByFn(
        index: number,
        item: IOFullInfo
    ): string {
        return hubAttachedIosIdFn(item);
    }

    public virtualPortWithConfigurationTrackByFn(
        _: number,
        virtualPortWithConfiguration: VirtualPortConfigurationWithData
    ): string {
        return `${virtualPortWithConfiguration.ioA?.portId}/${virtualPortWithConfiguration.ioB?.portId}`;
    }

    public deleteVirtualPortConfiguration(
        virtualPortConfiguration: VirtualPortConfigurationWithData
    ): void {
        this.confirmDialogService.show(
            this.translocoService.selectTranslate('io.virtualPortDeleteConfirmationDialogTitle', virtualPortConfiguration),
            this
        ).subscribe((result) => {
            if (result) {
                this.store.dispatch(VIRTUAL_PORTS_ACTIONS.deleteVirtualPort({
                    id: hubVirtualPortConfigIdFn(virtualPortConfiguration),
                    configName: virtualPortConfiguration.name,
                }));
            }
            this.confirmDialogService.hide(this);
        });
    }

    public ngOnDestroy(): void {
        this.confirmDialogService.hide(this);
    }
}
