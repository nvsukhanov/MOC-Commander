import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HUBS_SELECTORS } from '../../store';
import { MatSelectModule } from '@angular/material/select';
import { LetModule, PushModule } from '@ngrx/component';
import { NgForOf } from '@angular/common';

export type ControlSchemeBindingOutputConfig = {
    readonly hubId?: string;
    readonly portId?: number;
    readonly portModeId?: number;
}

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-output',
    templateUrl: './control-scheme-binding-output.component.html',
    styleUrls: [ './control-scheme-binding-output.component.scss' ],
    imports: [
        MatSelectModule,
        LetModule,
        PushModule,
        NgForOf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingOutputComponent {
    public readonly config$: Observable<ControlSchemeBindingOutputConfig | undefined>;

    public readonly hubsList$ = this.store.select(HUBS_SELECTORS.selectHubs);

    private readonly _configSubject = new BehaviorSubject<ControlSchemeBindingOutputConfig | undefined>(undefined);

    constructor(
        private readonly store: Store
    ) {
        this.config$ = this._configSubject;
    }

    @Input()
    public set outputConfig(config: ControlSchemeBindingOutputConfig | undefined) {
        this._configSubject.next(config);
    }
}
