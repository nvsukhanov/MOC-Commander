import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
    imports: [
        MatDialogModule
    ],
    providers: [
        ConfirmationDialogService
    ]
})
export class ConfirmationDialogModule {
}
