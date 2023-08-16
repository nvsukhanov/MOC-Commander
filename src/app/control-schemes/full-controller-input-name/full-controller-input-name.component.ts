import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, filter, map, of, switchMap } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, ControlSchemeInput, ControllerModel, ControllerProfileFactoryService } from '@app/store';
import { ControllerInputType } from '@app/shared';

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
export class FullControllerInputNameComponent {
    @Input() public showDisconnectedState = false;

    private _inputName: Observable<string> = of('');

    private _isConnected$: Observable<boolean> = of(true);

    constructor(
        private readonly store: Store,
        private readonly profileFactory: ControllerProfileFactoryService,
        private readonly translocoService: TranslocoService
    ) {
    }

    @Input()
    public set inputData(
        data: ControlSchemeInput | undefined
    ) {
        if (!data) {
            this._inputName = of('');
            this._isConnected$ = of(false);
            return;
        }
        const profile$ = this.store.select(CONTROLLER_SELECTORS.selectById(data.controllerId)).pipe(
            filter((controller): controller is ControllerModel => !!controller),
            map((controller) => this.profileFactory.getByProfileUid(controller.profileUid))
        );

        const controllerName$ = profile$.pipe(switchMap((profile) => profile.name$));

        if (data.inputType === ControllerInputType.ButtonGroup) {
            const buttonName$ = profile$.pipe(
                switchMap((p) => data.buttonId !== null
                                 ? p.getButtonName$(data.buttonId)
                                 : this.translocoService.selectTranslate('controllerProfiles.hub.unknownButton'))
            );
            this._inputName = controllerName$.pipe(
                combineLatestWith(buttonName$),
                switchMap(([ controllerName, inputName ]) =>
                    this.translocoService.selectTranslate('controlScheme.fullControllerInputNameWithPort', { controllerName, inputName, portId: data.portId })
                )
            );
        } else {
            const inputName$ = data.inputType === ControllerInputType.Axis
                               ? profile$.pipe(switchMap((p) => p.getAxisName$(data.inputId)))
                               : profile$.pipe(switchMap((p) => p.getButtonName$(data.inputId)));
            this._inputName = controllerName$.pipe(
                combineLatestWith(inputName$),
                switchMap(([ controllerName, inputName ]) =>
                    this.translocoService.selectTranslate('controlScheme.fullControllerInputName', { controllerName, inputName })
                )
            );
        }

        if (this.showDisconnectedState) {
            this._isConnected$ = this.store.select(CONTROLLER_CONNECTION_SELECTORS.isConnected(data.controllerId));
        } else {
            this._isConnected$ = of(true);
        }

    }

    public get isConnected$(): Observable<boolean> {
        return this._isConnected$;
    }

    public get inputName$(): Observable<string> {
        return this._inputName;
    }
}
