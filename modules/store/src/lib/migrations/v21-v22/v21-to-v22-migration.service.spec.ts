import { Language } from '@app/shared-i18n';

import { AppStoreVersion } from '../../app-store-version';
import { V21_STORE_SAMPLE } from '../v21';
import { V21ToV22MigrationService } from './v21-to-v22-migration-service';
import { V22Store } from '../v22-v23';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';

describe('v21 to v22 migration', () => {
    let subject: V21ToV22MigrationService;

    beforeEach(() => {
        subject = new V21ToV22MigrationService();
    });

    it('should migrate theme', () => {
        const result = subject.migrate(V21_STORE_SAMPLE);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(result.settings?.appTheme).toEqual(V21_STORE_SAMPLE.settings!.theme);
        expect(Object.hasOwn(result, 'settings')).toBe(true);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(Object.hasOwn(result.settings!, 'theme')).toBe(false);
        ensureStorePropsNotChanged<keyof V22Store>(
            V21_STORE_SAMPLE,
            result,
            [ 'settings', 'storeVersion' ]
        );
    });

    it('should not set theme if not present', () => {
        const result = subject.migrate({});
        expect(result.settings?.appTheme).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(Object.hasOwn(result.settings!, 'appTheme')).toBe(false);
        ensureStorePropsNotChanged<keyof V22Store>(
            {},
            result,
            []
        );
    });

    it('should migrate language', () => {
        const result = subject.migrate(V21_STORE_SAMPLE);
        expect(result.settings?.language).toEqual(Language.Russian);
        expect(Object.hasOwn(result, 'settings')).toBe(true);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(Object.hasOwn(result.settings!, 'language')).toBe(true);
        ensureStorePropsNotChanged<keyof V22Store>(
            V21_STORE_SAMPLE,
            result,
            [ 'settings', 'storeVersion' ]
        );
    });

    it('should not set language if not present', () => {
        const result = subject.migrate({});
        expect(result.settings?.language).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(Object.hasOwn(result.settings!, 'language')).toBe(false);
        ensureStorePropsNotChanged<keyof V22Store>(
            {},
            result,
            []
        );
    });

    it('should set store version', () => {
        const result = subject.migrate(V21_STORE_SAMPLE);
        expect(result.storeVersion).toEqual(AppStoreVersion.v22);
        ensureStorePropsNotChanged<keyof V22Store>(
            V21_STORE_SAMPLE,
            result,
            [ 'settings', 'storeVersion' ]
        );
    });
});
