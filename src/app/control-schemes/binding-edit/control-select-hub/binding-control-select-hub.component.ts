import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, map, of, startWith } from 'rxjs';
import { PushPipe } from '@ngrx/component';

import { HubWithConnectionState } from '../types';

@Component({
    standalone: true,
    selector: 'app-binding-select-hub',
    templateUrl: './binding-control-select-hub.component.html',
    styleUrls: [ './binding-control-select-hub.component.scss' ],
    imports: [
        PushPipe,
        MatSelectModule,
        ReactiveFormsModule,
        NgIf,
        NgForOf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectHubComponent implements OnChanges {
    @Input() public control?: FormControl<string>;

    private _hubIds: string[] = [];

    private _hubMap: { [k in string]?: HubWithConnectionState } = {};

    private _isHubKnown$: Observable<boolean> = of(false);

    @Input()
    public set hubsWithConnectionState(
        data: HubWithConnectionState[]
    ) {
        this._hubIds = data.map((hubData) => hubData.hubId);
        this._hubMap = {};
        for (const hubData of data) {
            this._hubMap[hubData.hubId] = hubData;
        }
    }

    public get hubIds(): string[] {
        return this._hubIds;
    }

    public get isHubKnown$(): Observable<boolean> {
        return this._isHubKnown$;
    }

    public ngOnChanges(): void {
        if (this.control) {
            this._isHubKnown$ = this.control.valueChanges.pipe(
                startWith(this.control.value),
                map((hubId) => this._hubMap[hubId] !== undefined),
            );
        } else {
            this._isHubKnown$ = of(false);
        }
    }

    public getHubName(
        hubId: string
    ): string | undefined {
        return this._hubMap[hubId]?.name;
    }
}
