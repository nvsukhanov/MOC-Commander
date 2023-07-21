import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ControllerInputType } from '@app/shared';
import { Store } from '@ngrx/store';
import { NEVER, Observable, filter, map, of, switchMap } from 'rxjs';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, ControllerModel } from '@app/store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';

import { ControllerProfileFactoryService } from '../../controller-profiles';

@Component({
    standalone: true,
    selector: 'app-full-controller-input-name',
    templateUrl: './full-controller-input-name.component.html',
    styleUrls: [ './full-controller-input-name.component.scss' ],
    imports: [
        PushPipe,
        NgIf,
        TranslocoModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullControllerInputNameComponent implements OnChanges {
    @Input() public controllerId?: string;

    @Input() public inputId?: string;

    @Input() public inputType?: ControllerInputType;

    @Input() public showDisconnectedState = false;

    private _controllerName$: Observable<string> = NEVER;

    private _inputName$: Observable<string> = NEVER;

    private _isConnected$: Observable<boolean> = of(true);

    constructor(
        private readonly store: Store,
        private readonly profileFactory: ControllerProfileFactoryService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public get isConnected$(): Observable<boolean> {
        return this._isConnected$;
    }

    public get controllerName$(): Observable<string> {
        return this._controllerName$;
    }

    public get inputName$(): Observable<string> {
        return this._inputName$;
    }

    public ngOnChanges(): void {
        if (this.controllerId === undefined || this.inputId === undefined || this.inputType === undefined) {
            this._controllerName$ = NEVER;
            this._inputName$ = NEVER;
            return;
        }

        const profile$ = this.store.select(CONTROLLER_SELECTORS.selectById(this.controllerId)).pipe(
            filter((controller): controller is ControllerModel => !!controller),
            map((controller) => this.profileFactory.getByProfileUid(controller.profileUid))
        );

        this._controllerName$ = profile$.pipe(
            map((profile) => profile.nameL10nKey),
            switchMap((nameL10nKey) => this.translocoService.selectTranslate(nameL10nKey))
        );
        this._inputName$ = this.store.select(CONTROLLER_SELECTORS.selectById(this.controllerId)).pipe(
            filter((controller): controller is ControllerModel => !!controller),
            map((controller) => this.profileFactory.getByProfileUid(controller?.profileUid)),
            switchMap((profile) => {
                if (this.inputType === ControllerInputType.Axis && this.inputId !== undefined) {
                    return profile.getAxisName$(this.inputId);
                }
                if (this.inputType === ControllerInputType.Button && this.inputId !== undefined) {
                    return profile.getButtonName$(this.inputId);
                }
                return NEVER;
            })
        );

        if (this.showDisconnectedState) {
            this._isConnected$ = this.store.select(CONTROLLER_CONNECTION_SELECTORS.isConnected(this.controllerId));
        } else {
            this._isConnected$ = of(true);
        }
    }
}
