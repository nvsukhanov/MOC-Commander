import { getEnumKeys } from './get-enum-keys';

export function getEnumValues<T extends { [k in string]: string | number }>(e: T): Array<T[keyof T]> {
    return getEnumKeys(e).map((k) => e[k]);
}
