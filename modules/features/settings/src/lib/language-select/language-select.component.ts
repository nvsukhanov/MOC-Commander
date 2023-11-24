import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgForOf } from '@angular/common';
import { Language, getEnumValues } from '@app/shared';

import { LanguageToL10nKeyPipe } from './language-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'feat-settings-language-select',
    templateUrl: './language-select.component.html',
    styleUrls: [ './language-select.component.scss' ],
    imports: [
        MatSelectModule,
        TranslocoPipe,
        LanguageToL10nKeyPipe,
        NgForOf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectComponent {
    @Input() public language: Language = Language.English;

    @Output() public readonly languageChange = new EventEmitter<Language>();

    public readonly languages: ReadonlyArray<Language> = getEnumValues(Language);

    public onLanguageChange(
        language: Language
    ): void {
        this.languageChange.emit(language);
    }
}
