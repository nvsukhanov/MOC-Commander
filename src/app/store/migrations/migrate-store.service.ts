import { Inject, Injectable } from '@angular/core';
import { IState } from '@app/store';
import { DeepPartial } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';
import { IMigration, STORE_MIGRATION } from './i-migration';

@Injectable()
export class MigrateStoreService {
    constructor(
        @Inject(STORE_MIGRATION) private readonly migrations: IMigration<object, object>[],
    ) {
    }

    public migrateToVersion(
        data: object,
        toVersion: AppStoreVersion,
    ): IState {
        const initialVersion = this.getInitialVersion(data);
        if (!initialVersion) {
            throw new Error(`Initial version not found`);
        }
        const migrationChain = this.buildMigrationChain(initialVersion, toVersion);
        return migrationChain.reduce((prev, migration) => migration.migrate(prev), data) as IState;
    }

    // we assume here that migrations are linear, not a graph
    private buildMigrationChain(
        fromVersion: AppStoreVersion,
        toVersion: AppStoreVersion,
    ): IMigration<object, object>[] {
        const chain: IMigration<object, object>[] = [];
        let currentVersion = fromVersion;
        while (currentVersion !== toVersion) {
            const migration = this.migrations.find((m) => m.fromVersion === currentVersion);
            if (!migration) {
                throw new Error(`Migration from ${currentVersion} to ${toVersion} not found`);
            }
            if (chain.includes(migration)) {
                throw new Error(`Migration loop detected: ${currentVersion} -> ${toVersion}`);
            }
            chain.push(migration);
            currentVersion = migration.toVersion;
        }
        return chain;
    }

    private getInitialVersion(
        data: object,
    ): AppStoreVersion | undefined {
        const versionKey: keyof IState = 'storeVersion';
        if (Object.hasOwn(data, versionKey)) {
            return (data as DeepPartial<IState>)[versionKey];
        }
        return undefined;
    }
}
