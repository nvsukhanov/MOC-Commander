import { Provider } from '@angular/core';

import { STORE_MIGRATION } from './i-migration';
import { V21ToV22MigrationService } from './v21-to-v22-migration-service';
import { MigrateStoreService } from './migrate-store.service';
import { V22ToV23MigrationService } from './v22-to-v23-migration.service';
import { V23ToV24MigrationService } from './v23-to-v24-migration.service';
import { V24ToV25MigrationService } from './v24-to-v25-migration.service';
import { V25ToV26MigrationService } from './v25-to-v26-migration.service';
import { V26ToV27MigrationService } from './v26-to-v27-migration.service';
import { V27ToV28MigrationService } from './v27-to-v28-migration.service';
import { V28ToV29MigrationService } from './v28-to-v29-migration.service';

export function provideStoreMigrations(): Provider[] {
    return [
        { provide: STORE_MIGRATION, useClass: V21ToV22MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V22ToV23MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V23ToV24MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V24ToV25MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V25ToV26MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V26ToV27MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V27ToV28MigrationService, multi: true },
        { provide: STORE_MIGRATION, useClass: V28ToV29MigrationService, multi: true },
        MigrateStoreService
    ];
}
