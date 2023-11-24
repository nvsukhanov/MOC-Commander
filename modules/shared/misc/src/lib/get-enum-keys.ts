// a dirty hack to get enum keys
export function getEnumKeys<T extends { [k in string]: string | number }>(e: T): Array<keyof T> {
    const result: Array<keyof T> = [];
    const entriesMap = new Map(Object.entries(e));

    // first we filter out numeric keys since if we have a numeric key, we also have a string key with the same value
    const numericKeys = [ ...entriesMap.keys() ].filter((k) => !isNaN(Number(k)));
    for (const [ k, v ] of numericKeys) {
        // we delete key-value pair from entriesMap
        entriesMap.delete(k);
        // also we delete key-value pair from entriesMap for the value of the numeric key since that is how enums work
        entriesMap.delete(`${v}`);
    }
    result.push(...[ ...entriesMap.keys() ] as Array<keyof T>);
    return result;
}
