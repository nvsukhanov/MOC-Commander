import { Provider } from '@angular/core';

import { STORE_MIGRATION } from './i-migration';
import { V21ToV22Migration } from './v21-to-v22-migration';
import { MigrateStoreService } from './migrate-store.service';

export function provideStoreMigrations(): Provider[] {
    return [
        { provide: STORE_MIGRATION, useClass: V21ToV22Migration, multi: true },
        MigrateStoreService
    ];
}
