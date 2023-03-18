export class Lpf2ConnectionError extends Error {
    public readonly type = 'Lpf2 connection error';

    constructor(message: string) {
        super(message);
    }
}
