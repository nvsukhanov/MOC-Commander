import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@app/shared';

@Pipe({
    standalone: true,
    name: 'languageToL10nKey',
    pure: true
})
export class LanguageToL10nKeyPipe implements PipeTransform {
    private readonly languageToL10nKeyMap: { [k in Language]: string } = {
        [Language.English]: 'language.en',
        [Language.Russian]: 'language.ru'
    };

    public transform(
        language: Language
    ): string {
        return this.languageToL10nKeyMap[language];
    }
}
