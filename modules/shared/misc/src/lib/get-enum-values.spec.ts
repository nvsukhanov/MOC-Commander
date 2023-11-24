import { getEnumValues } from './get-enum-values';

describe('getEnumValues', () => {
    it('should return the correct enum values for a string enum', () => {
        enum TestEnum {
            A = 'q',
            B = 'w',
            C = 'e'
        }

        const result = getEnumValues(TestEnum);
        expect(result).toContain('q');
        expect(result).toContain('w');
        expect(result).toContain('e');
    });

    it('should return the correct enum values for a numeric enum', () => {
        enum TestEnum {
            A = 11,
            B = 22,
            C = 33
        }

        const result = getEnumValues(TestEnum);
        expect(result).toContain(11);
        expect(result).toContain(22);
        expect(result).toContain(33);
    });

    it('should return the correct enum values for a mixed enum', () => {
        enum TestEnum {
            A = 11,
            B = 'w',
            C = 33
        }

        const result = getEnumValues(TestEnum);
        expect(result).toContain(11);
        expect(result).toContain('w');
        expect(result).toContain(33);
    });
});
