import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GamepadSettingsModel } from '@app/store';
import { ControllerType, GamepadAxisSettings, GamepadButtonSettings, MAX_INPUT_VALUE, MIN_INPUT_VALUE, ToFormGroup } from '@app/shared';

import { GamepadSettingsForm } from './types';

@Injectable()
export class GamepadSettingsFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    public buildSettingsForm(
        settings: GamepadSettingsModel
    ): GamepadSettingsForm {
        const form = this.formBuilder.group({
            controllerId: this.formBuilder.control<string>(settings.controllerId, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            controllerType: this.formBuilder.control<ControllerType.Gamepad>(settings.controllerType, { nonNullable: true }),
            axisConfigs: this.formBuilder.group<{ [k in string]: ToFormGroup<GamepadAxisSettings> }>({}),
            buttonConfigs: this.formBuilder.group<{ [k in string]: ToFormGroup<GamepadButtonSettings> }>({}),
            ignoreInput: this.formBuilder.control<boolean>(settings.ignoreInput, { nonNullable: true }),
        });
        for (const [ axisId, axisSettings ] of Object.entries(settings.axisConfigs)) {
            form.controls.axisConfigs.addControl(
                axisId,
                this.formBuilder.group({
                    activeZoneStart: this.formBuilder.control<number>(axisSettings.activeZoneStart, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    activeZoneEnd: this.formBuilder.control<number>(axisSettings.activeZoneEnd, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    invert: this.formBuilder.control<boolean>(axisSettings.invert, { nonNullable: true }),
                    ignoreInput: this.formBuilder.control<boolean>(axisSettings.ignoreInput, { nonNullable: true }),
                    trim: this.formBuilder.control<number>(axisSettings.trim, {
                        nonNullable: true,
                        validators: [ Validators.min(MIN_INPUT_VALUE), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    activationThreshold: this.formBuilder.control<number>(axisSettings.activationThreshold, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    negativeValueCanActivate: this.formBuilder.control<boolean>(axisSettings.negativeValueCanActivate, { nonNullable: true }),
                })
            );
        }
        for (const [ buttonId, buttonSettings ] of Object.entries(settings.buttonConfigs)) {
            form.controls.buttonConfigs.addControl(
                buttonId,
                this.formBuilder.group({
                    activeZoneStart: this.formBuilder.control<number>(buttonSettings.activeZoneStart, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    activeZoneEnd: this.formBuilder.control<number>(buttonSettings.activeZoneEnd, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    ignoreInput: this.formBuilder.control<boolean>(buttonSettings.ignoreInput, { nonNullable: true }),
                    trim: this.formBuilder.control<number>(buttonSettings.trim, {
                        nonNullable: true,
                        validators: [ Validators.min(MIN_INPUT_VALUE), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    activationThreshold: this.formBuilder.control<number>(buttonSettings.activationThreshold, {
                        nonNullable: true,
                        validators: [ Validators.min(0), Validators.max(MAX_INPUT_VALUE) ]
                    }),
                    negativeValueCanActivate: this.formBuilder.control<boolean>(buttonSettings.negativeValueCanActivate, { nonNullable: true }),
                    invert: this.formBuilder.control<boolean>(buttonSettings.invert, { nonNullable: true }),
                })
            );
        }
        return form;
    }
}
