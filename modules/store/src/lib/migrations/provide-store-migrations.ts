import { Provider } from '@angular/core';

import { STORE_MIGRATION } from './i-migration';
import { MigrateStoreService } from './migrate-store.service';
import { V21ToV22MigrationService } from './v21-v22';
import { V22ToV23MigrationService } from './v22-v23';
import { V23ToV24MigrationService } from './v23-v24';
import { V24ToV25MigrationService } from './v24-v25';
import { V25ToV26MigrationService } from './v25-v26';
import { V26ToV27MigrationService } from './v26-v27';
import { V27ToV28MigrationService } from './v27-v28';
import { V28ToV29MigrationService } from './v28-v29';
import { V29ToV30MigrationService } from './v29-v30';

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
        { provide: STORE_MIGRATION, useClass: V29ToV30MigrationService, multi: true },
        MigrateStoreService
    ];
}
