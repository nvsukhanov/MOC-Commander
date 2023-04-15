export interface ILogger {
    debug(...debug: unknown[]): void;

    info(...info: unknown[]): void;

    warning(...warning: unknown[]): void;

    error(error: Error | string): void;
}
