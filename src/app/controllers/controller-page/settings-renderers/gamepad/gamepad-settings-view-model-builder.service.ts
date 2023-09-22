import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap } from 'rxjs';
import { CONTROLLER_INPUT_SELECTORS, CONTROLLER_SELECTORS, ControllerModel, GamepadSettingsModel, controllerInputIdFn } from '@app/store';
import { ControllerInputType, GamepadProfileFactoryService, GamepadSettings, IControllerProfile } from '@app/shared';

import { GamepadSettingsAxisSettingsViewModel, GamepadSettingsButtonSettingsViewModel, GamepadSettingsForm, GamepadSettingsViewModel } from './types';

@Injectable()
export class GamepadSettingsViewModelBuilderService {
    constructor(
        private readonly store: Store,
        private readonly profileFactoryService: GamepadProfileFactoryService,
    ) {
    }

    public buildViewModel(
        form: GamepadSettingsForm,
        settings: GamepadSettingsModel,
    ): GamepadSettingsViewModel {
        const controllerState = this.store.select(CONTROLLER_SELECTORS.selectById(settings.controllerId));
        const profile$ = controllerState.pipe(
            filter((cs): cs is ControllerModel => !!cs),
            map(({ profileUid }) => this.profileFactoryService.getByProfileUid(profileUid)),
            filter((profile): profile is IControllerProfile<GamepadSettings> => !!profile),
        );

        return {
            axes: this.buildAxisViewModel(settings, profile$, form),
            buttons: this.buildButtonViewModel(settings, profile$, form),
            ignoreInputControl: form.controls.ignoreInput,
        };
    }

    private buildAxisViewModel(
        settings: GamepadSettingsModel,
        profile$: Observable<IControllerProfile<GamepadSettings>>,
        form: GamepadSettingsForm,
    ): GamepadSettingsAxisSettingsViewModel[] {
        const result: GamepadSettingsAxisSettingsViewModel[] = [];
        for (const axisId of Object.keys(settings.axisConfigs)) {
            const controllerId = controllerInputIdFn({
                controllerId: settings.controllerId,
                inputId: axisId,
                inputType: ControllerInputType.Axis,
            });

            const rawValue$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectRawValueById(controllerId));
            const outputValue$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(controllerId));
            const isActivated$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectIsActivatedById(controllerId));

            result.push({
                inputId: axisId,
                form: form.controls.axisConfigs.controls[axisId],
                name$: profile$.pipe(
                    switchMap((profile) => profile.getAxisName$(axisId)),
                ),
                rawValue$,
                outputValue$,
                isActivated$
            });
        }
        return result;
    }

    private buildButtonViewModel(
        settings: GamepadSettingsModel,
        profile$: Observable<IControllerProfile<GamepadSettings>>,
        form: GamepadSettingsForm,
    ): GamepadSettingsButtonSettingsViewModel[] {
        const result: GamepadSettingsButtonSettingsViewModel[] = [];
        for (const buttonId of Object.keys(settings.buttonConfigs)) {
            const controllerId$ = profile$.pipe(
                map((profile) => {
                    if (profile.triggerButtonsIndices.includes(+buttonId)) {
                        return controllerInputIdFn({
                            controllerId: settings.controllerId,
                            inputId: buttonId,
                            inputType: ControllerInputType.Trigger,
                        });
                    }
                    return controllerInputIdFn({
                        controllerId: settings.controllerId,
                        inputId: buttonId,
                        inputType: ControllerInputType.Button,
                    });
                })
            );

            const rawValue$ = controllerId$.pipe(
                switchMap((controllerId) => this.store.select(CONTROLLER_INPUT_SELECTORS.selectRawValueById(controllerId)))
            );

            const outputValue$ = controllerId$.pipe(
                switchMap((controllerId) => this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(controllerId)))
            );

            const isActivated$ = controllerId$.pipe(
                switchMap((controllerId) => this.store.select(CONTROLLER_INPUT_SELECTORS.selectIsActivatedById(controllerId)))
            );

            result.push({
                inputId: buttonId,
                form: form.controls.buttonConfigs.controls[buttonId],
                name$: profile$.pipe(
                    switchMap((profile) => profile.getButtonName$(buttonId)),
                ),
                rawValue$,
                outputValue$,
                isActivated$
            });
        }
        return result;
    }
}
