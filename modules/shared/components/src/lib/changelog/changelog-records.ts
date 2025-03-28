import { InjectionToken } from '@angular/core';

export type ChangelogRecords = Array<{
    version: string;
    changeL10nKeys: Array<string>;
}>;

export const CHANGELOG_TOKEN = new InjectionToken<ChangelogRecords>('CHANGELOG');
