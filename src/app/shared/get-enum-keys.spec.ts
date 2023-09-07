import { getEnumKeys } from './get-enum-keys';

describe('getEnumKeys', () => {
    it('should return the correct enum keys for a string enum', () => {
        enum TestEnum {
            A = 'q',
            B = 'w',
            C = 'e'
        }

        const result = getEnumKeys(TestEnum);
        expect(result).toContain('A');
        expect(result).toContain('B');
        expect(result).toContain('C');
    });

    it('should return the correct enum keys for a numeric enum', () => {
        enum TestEnum {
            A = 1,
            B = 2,
            T = 3
        }

        const result = getEnumKeys(TestEnum);
        expect(result).toContain('A');
        expect(result).toContain('B');
        expect(result).toContain('T');
    });

    it('should return the correct enum keys for a mixed enum', () => {
        enum TestEnum {
            A = 11,
            B = 'b',
            T = 33
        }

        const result = getEnumKeys(TestEnum);
        expect(result).toContain('A');
        expect(result).toContain('B');
        expect(result).toContain('T');
    });
});
