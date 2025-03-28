import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { Language } from '@app/shared-i18n';
import { getEnumValues } from '@app/shared-misc';

import { LanguageToL10nKeyPipe } from './language-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'page-settings-language-select',
    templateUrl: './language-select.component.html',
    styleUrl: './language-select.component.scss',
    imports: [
        MatSelectModule,
        TranslocoPipe,
        LanguageToL10nKeyPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectComponent {
    @Input() public language: Language | null = Language.English;

    @Output() public readonly languageChange = new EventEmitter<Language>();

    public readonly languages: ReadonlyArray<Language> = getEnumValues(Language);

    public onLanguageChange(
        language: Language
    ): void {
        this.languageChange.emit(language);
    }
}
