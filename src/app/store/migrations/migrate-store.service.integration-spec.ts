import { TestBed } from '@angular/core/testing';
import { DeepPartial } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';
import { IState } from '../i-state';
import { V21Store } from './v21-store';
import { V21_STORE_SAMPLE } from './v21-store-sample';
import { provideStoreMigrations } from './provide-store-migrations';
import { MigrateStoreService } from './migrate-store.service';

describe('MigrateStoreService', () => {
    let storeSample: DeepPartial<V21Store>;

    beforeEach(() => {
        storeSample = V21_STORE_SAMPLE;
        TestBed.configureTestingModule({ providers: provideStoreMigrations() });
    });

    it('should migrate data from first version to last using real migrations', () => {
        const store = TestBed.inject(MigrateStoreService).migrateToVersion(storeSample, AppStoreVersion.latest);
        const expectedResult: DeepPartial<IState> = {
            ...storeSample,
            settings: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                appTheme: storeSample.settings!.theme!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                language: storeSample.settings!.language!,
            },
            storeVersion: AppStoreVersion.latest
        };
        expect(store).toEqual(expectedResult);
    });
});
