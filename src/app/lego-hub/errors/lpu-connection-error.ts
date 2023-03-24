export class LpuConnectionError extends Error {
    public readonly type = 'Lpu connection error';

    constructor(message: string) {
        super(message);
    }
}
