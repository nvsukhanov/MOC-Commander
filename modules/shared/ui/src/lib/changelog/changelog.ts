export type Changelog = Array<{
    version: string;
    changeL10nKeys: Array<string>;
}>;

export const CHANGELOG: Changelog = [
    {
        version: '1.3.0',
        changeL10nKeys: [
            'changelog.1-3-0.featOnOffToggleInputPreset'
        ]
    },
    {
        version: '1.2.3',
        changeL10nKeys: [
            'changelog.1-2-3.featImprovedUiPerformance',
            'changelog.1-2-3.featRaiseServoMotorRangeLimit',
            'changelog.1-2-3.featSeparateControlsForForwardAndBackwardSpeed',
            'changelog.1-2-3.featDirectionAwareControls',
            'changelog.1-2-3.featInputGainForBrakeInputOfSpeedBinding',
            'changelog.1-2-3.featBetterL10nForTrainAndGearbox',
            'changelog.1-2-3.changeStepperNegativeValuesRemoved',
            'changelog.1-2-3.featAcquireWakeLockWhenAtLeastOneHubIsConnected',
            'changelog.1-2-3.featHubHWAndSWVersionInHubInfo',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.2.2',
        changeL10nKeys: [
            'changelog.1-2-2.featThisChangelog',
            'changelog.1-2-2.featSeparateControlsForServoCwAndCcw',
            'changelog.1-2-2.featMotorPositionAdjustment',
            'changelog.1-2-2.featUseLinuxCompatSetting',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.2.1',
        changeL10nKeys: [
            'changelog.1-2-1.featFasterServoCalibration',
            'changelog.1-2-1.featAppUpdatedNotification',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.2.0',
        changeL10nKeys: [
            'changelog.1-2-0.featUnsavedChangesNotifications',
            'changelog.1-2-0.featWakeLock',
            'changelog.1-2-0.featNavigationBreadcrumbs',
            'changelog.1-2-0.featControlSchemeNameAutoGeneration',
            'changelog.1-2-0.featAxialAwarenessForStepperTrainAndGearboxControls',
            'changelog.1-2-0.featReadAndSetMotorPositionDuringControlSchemeEditing',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.1.0',
        changeL10nKeys: [
            'changelog.1-1-0.featAddInstallationInstructions',
            'changelog.1-1-0.featAddSteamDeckControllerProfile',
            'changelog.1-1-0.featMakeAppInstallableAsPWA',
            'changelog.1-1-0.featWidgets',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.0.2',
        changeL10nKeys: [
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.0.1',
        changeL10nKeys: [
            'changelog.1-0-1.featIncreaseGamepadReadFrequency',
            'changelog.bugfixesAndImprovements'
        ]
    },
    {
        version: '1.0.0',
        changeL10nKeys: [
            'changelog.1-0-0.initialRelease'
        ]
    }
];
