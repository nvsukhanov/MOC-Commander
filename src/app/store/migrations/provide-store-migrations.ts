import { Provider } from '@angular/core';

import { STORE_MIGRATION } from './i-migration';
import { V21ToV22MigrationService } from './v21-to-v22-migration-service';
import { MigrateStoreService } from './migrate-store.service';
import { V22ToV23MigrationService } from './v22-to-v23-migration.service';

export function provideStoreMigrations(): Provider[] {
    return [
        { provide: STORE_MIGRATION, useClass: V21ToV22MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V22ToV23MigrationService, multi: true },
        MigrateStoreService
    ];
}
