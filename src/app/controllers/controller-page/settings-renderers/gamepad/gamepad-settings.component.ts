import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, animationFrameScheduler, map, of, take, throttleTime } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_SELECTORS, GamepadSettingsModel } from '@app/store';
import {
    GamepadProfile,
    GamepadProfileFactoryService,
    HideOnSmallScreenDirective,
    InputActivityIndicatorComponent,
    RangeControlComponent,
    ToggleControlComponent
} from '@app/shared';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { InputOutputDiagramComponent } from './input-output-diagram';
import { InputValuePercentHumanReadableValuePipe } from './active-zone-human-readable-value.pipe';
import { ControlIgnoreInputComponent } from '../control-ignore-input';
import { GamepadSettingsFormBuilderService } from './gamepad-settings-form-builder.service';
import { GamepadSettingsAxisSettingsViewModel, GamepadSettingsButtonSettingsViewModel, GamepadSettingsForm, GamepadSettingsViewModel } from './types';
import { GamepadSettingsViewModelBuilderService } from './gamepad-settings-view-model-builder.service';
import { GamepadSettingsAxisSettingsComponent } from './axis-settings';
import { GamepadSettingsButtonSettingsComponent } from './button-settings';

@Component({
    standalone: true,
    selector: 'app-generic-gamepad-settings',
    templateUrl: './gamepad-settings.component.html',
    styleUrls: [ './gamepad-settings.component.scss' ],
    imports: [
        NgIf,
        ControlIgnoreInputComponent,
        NgForOf,
        PushPipe,
        InputOutputDiagramComponent,
        ToggleControlComponent,
        RangeControlComponent,
        TranslocoPipe,
        InputValuePercentHumanReadableValuePipe,
        MatDividerModule,
        MatExpansionModule,
        GamepadSettingsAxisSettingsComponent,
        GamepadSettingsButtonSettingsComponent,
        InputActivityIndicatorComponent,
        HideOnSmallScreenDirective,
        MatButtonModule
    ],
    providers: [
        GamepadSettingsFormBuilderService,
        GamepadSettingsViewModelBuilderService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadSettingsComponent implements IControllerSettingsRenderer<GamepadSettingsModel>, OnInit, OnDestroy {
    private _viewModel?: GamepadSettingsViewModel;

    private isCapturingInput = false;

    private formValueChangesSubscription?: Subscription;

    private gamepadSettingsForm?: GamepadSettingsForm;

    private profile$: Observable<GamepadProfile | null> = of(null);

    private readonly _settingsChanges$ = new Subject<GamepadSettingsModel>();

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store,
        private readonly formBuilder: GamepadSettingsFormBuilderService,
        private readonly viewModelBuilder: GamepadSettingsViewModelBuilderService,
        private readonly profileFactoryService: GamepadProfileFactoryService
    ) {
    }

    public get settingsChanges$(): Observable<GamepadSettingsModel> {
        return this._settingsChanges$;
    }

    public get viewModel(): GamepadSettingsViewModel | undefined {
        return this._viewModel;
    }

    public trackAxisByInputIdFn(
        index: number,
        axis: GamepadSettingsAxisSettingsViewModel
    ): string {
        return axis.inputId;
    }

    public trackButtonByInputIdFn(
        index: number,
        button: GamepadSettingsButtonSettingsViewModel
    ): string {
        return button.inputId;
    }

    public ngOnInit(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
        this.isCapturingInput = true;
    }

    public ngOnDestroy(): void {
        this.formValueChangesSubscription?.unsubscribe();
        if (this.isCapturingInput) {
            this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
        }
    }

    public loadSettings(
        settings: GamepadSettingsModel
    ): void {
        if (settings.controllerId === this.gamepadSettingsForm?.controls.controllerId.value) {
            return;
        }
        const settingsForm = this.formBuilder.buildSettingsForm(settings);
        const viewModel = this.viewModelBuilder.buildViewModel(settingsForm, settings);

        this.formValueChangesSubscription?.unsubscribe();
        this.formValueChangesSubscription = settingsForm.valueChanges.pipe(
            throttleTime(100, animationFrameScheduler, { trailing: true }),
        ).subscribe(() => {
            const rawValue = this.gamepadSettingsForm?.getRawValue();
            if (rawValue) {
                this._settingsChanges$.next(rawValue);
            }
        });

        this.profile$ = this.store.select(CONTROLLER_SELECTORS.selectById(settingsForm.controls.controllerId.value)).pipe(
            map((controllerModel) => controllerModel
                                     ? this.profileFactoryService.getByProfileUid(controllerModel.profileUid) as GamepadProfile
                                     : null
            )
        );

        this._viewModel = viewModel;
        this.gamepadSettingsForm = settingsForm;
        this.cdRef.detectChanges();
    }

    public resetAxisSettings(
        axisId: string
    ): void {
        if (!this.gamepadSettingsForm) {
            throw new Error('Gamepad settings form not found');
        }

        this.profile$.pipe(
            take(1)
        ).subscribe((profile) => {
            if (!profile) {
                throw new Error(`Profile with uid "${this.gamepadSettingsForm?.controls.controllerId.value}" not found`);
            }
            const defaultAxisSettings = profile.getDefaultSettings()?.axisConfigs[axisId];
            if (!defaultAxisSettings) {
                throw new Error(`Default axis settings for axis with id "${axisId}" not found`);
            }
            this.gamepadSettingsForm?.controls.axisConfigs.controls[axisId].setValue(defaultAxisSettings);
        });
    }

    public resetButtonSettings(
        buttonId: string
    ): void {
        this.profile$.pipe(
            take(1)
        ).subscribe((profile) => {
            if (!profile) {
                throw new Error(`Profile with uid "${this.gamepadSettingsForm?.controls.controllerId.value}" not found`);
            }
            const defaultButtonSettings = profile.getDefaultSettings()?.buttonConfigs[buttonId];
            if (!defaultButtonSettings) {
                throw new Error(`Default button settings for button with id "${buttonId}" not found`);
            }
            this.gamepadSettingsForm?.controls.buttonConfigs.controls[buttonId].setValue(defaultButtonSettings);
        });
    }
}
