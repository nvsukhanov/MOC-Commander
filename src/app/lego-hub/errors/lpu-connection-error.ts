export class LpuConnectionError extends Error {
    public readonly type = 'Lpu connection error';

    constructor(
        message: string,
        public readonly l10nKey: string
    ) {
        super(message);
    }
}
