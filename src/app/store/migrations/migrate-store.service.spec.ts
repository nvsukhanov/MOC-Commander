import { instance, mock, when } from 'ts-mockito';
import { AppStoreVersion } from '@app/store';

import { MigrateStoreService } from './migrate-store.service';
import { IMigration } from './i-migration';

type V1 = {
    data: number;
    storeVersion: '1';
};

type V2 = {
    v2Data: number;
    storeVersion: '2';
};

type V3 = {
    v3Data: number;
    storeVersion: '3';
};

describe('MigrateStoreService', () => {
    let subject: MigrateStoreService;
    let migrator1: IMigration<V1, V2>;
    let migrator2: IMigration<V2, V3>;
    let dataV1: V1;
    let dataV2: V2;
    let dataV3: V3;

    beforeEach(() => {
        dataV1 = { data: 1, storeVersion: '1' };
        dataV2 = { v2Data: 2, storeVersion: '2' };
        dataV3 = { v3Data: 3, storeVersion: '3' };
        migrator1 = mock<IMigration<V1, V2>>();
        when(migrator1.fromVersion).thenReturn('1' as unknown as AppStoreVersion);
        when(migrator1.toVersion).thenReturn('2' as unknown as AppStoreVersion);
        when(migrator1.migrate(dataV1)).thenReturn(dataV2);

        migrator2 = mock<IMigration<V2, V3>>();
        when(migrator2.fromVersion).thenReturn('2' as unknown as AppStoreVersion);
        when(migrator2.toVersion).thenReturn('3' as unknown as AppStoreVersion);
        when(migrator2.migrate(dataV2)).thenReturn(dataV3);

        subject = new MigrateStoreService([
            instance(migrator1),
            instance(migrator2),
        ]);
    });

    it('should migrate data from version 1 to version 3', () => {
        expect(subject.migrateToVersion(dataV1, '3' as unknown as AppStoreVersion)).toEqual(dataV3);
    });
});
