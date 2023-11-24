export function ensureStorePropsNotChanged<TKeys extends string>(
    prev: Partial<{ [k in TKeys]: unknown }>,
    next: Partial<{ [k in TKeys]: unknown }>,
    changedProps: Array<TKeys>,
): void {
    const changedPropsSet = new Set(changedProps);
    const prevKeys = Object.keys(prev) as Array<TKeys>;
    for (const prop of prevKeys) {
        if (changedPropsSet.has(prop)) {
            continue;
        }
        expect(prev[prop]).toBe(next[prop]);
    }
}
