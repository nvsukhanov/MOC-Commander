import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, animationFrameScheduler, map, of, take, throttleTime } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { GamepadProfile, GamepadProfileFactoryService } from '@app/controller-profiles';
import { HideOnSmallScreenDirective, InputActivityIndicatorComponent } from '@app/shared-components';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_SELECTORS, GamepadSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { InputOutputDiagramComponent } from './input-output-diagram';
import { ControlIgnoreInputComponent } from '../control-ignore-input';
import { GamepadSettingsFormBuilderService } from './gamepad-settings-form-builder.service';
import { GamepadSettingsForm, GamepadSettingsViewModel } from './types';
import { GamepadSettingsViewModelBuilderService } from './gamepad-settings-view-model-builder.service';
import { GamepadSettingsAxisSettingsComponent } from './axis-settings';
import { GamepadSettingsButtonSettingsComponent } from './button-settings';

@Component({
  standalone: true,
  selector: 'page-controller-view-generic-gamepad-settings',
  templateUrl: './gamepad-settings.component.html',
  styleUrl: './gamepad-settings.component.scss',
  imports: [
    ControlIgnoreInputComponent,
    InputOutputDiagramComponent,
    TranslocoPipe,
    MatDividerModule,
    MatExpansionModule,
    GamepadSettingsAxisSettingsComponent,
    GamepadSettingsButtonSettingsComponent,
    InputActivityIndicatorComponent,
    HideOnSmallScreenDirective,
    MatButtonModule,
    AsyncPipe,
  ],
  providers: [GamepadSettingsFormBuilderService, GamepadSettingsViewModelBuilderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private readonly profileFactoryService: GamepadProfileFactoryService,
  ) {}

  public get settingsChanges$(): Observable<GamepadSettingsModel> {
    return this._settingsChanges$;
  }

  public get viewModel(): GamepadSettingsViewModel | undefined {
    return this._viewModel;
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

  public loadSettings(settings: GamepadSettingsModel): void {
    if (settings.controllerId === this.gamepadSettingsForm?.controls.controllerId.value) {
      return;
    }
    const settingsForm = this.formBuilder.buildSettingsForm(settings);
    const viewModel = this.viewModelBuilder.buildViewModel(settingsForm, settings);

    this.formValueChangesSubscription?.unsubscribe();
    this.formValueChangesSubscription = settingsForm.valueChanges.pipe(throttleTime(100, animationFrameScheduler, { trailing: true })).subscribe(() => {
      const rawValue = this.gamepadSettingsForm?.getRawValue();
      if (rawValue) {
        this._settingsChanges$.next(rawValue);
      }
    });

    this.profile$ = this.store
      .select(CONTROLLER_SELECTORS.selectById(settingsForm.controls.controllerId.value))
      .pipe(map((controllerModel) => (controllerModel ? (this.profileFactoryService.getByProfileUid(controllerModel.profileUid) as GamepadProfile) : null)));

    this._viewModel = viewModel;
    this.gamepadSettingsForm = settingsForm;
    this.cdRef.detectChanges();
  }

  public resetAxisSettings(axisId: string): void {
    if (!this.gamepadSettingsForm) {
      throw new Error('Gamepad settings form not found');
    }

    this.profile$.pipe(take(1)).subscribe((profile) => {
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

  public resetButtonSettings(buttonId: string): void {
    this.profile$.pipe(take(1)).subscribe((profile) => {
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
