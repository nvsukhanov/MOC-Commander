/* eslint-disable no-console */
import { LoggingService } from './logging.service';
import { LogLevel } from './log-levels';

describe('LoggingService', () => {
    let subject: LoggingService;
    let error: Error;

    beforeEach(() => {
        error = new Error('test');
        jest.spyOn(console, 'debug').mockImplementation(() => void 0);
        jest.spyOn(console, 'info').mockImplementation(() => void 0);
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);
        jest.spyOn(console, 'error').mockImplementation(() => void 0);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('debug level', () => {
        beforeEach(() => {
            subject = new LoggingService(LogLevel.Debug);
        });

        it('should write debug messages', () => {
            subject.debug('test');
            expect(console.debug).toHaveBeenCalledWith('test');
        });

        it('should not write info messages', () => {
            subject.info('test');
            expect(console.info).toHaveBeenCalledWith('test');
        });

        it('should not write warning messages', () => {
            subject.warning('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('info level', () => {
        beforeEach(() => {
            subject = new LoggingService(LogLevel.Info);
        });

        it('should write debug messages', () => {
            subject.debug('test');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should write info messages', () => {
            subject.info('test');
            expect(console.info).toHaveBeenCalledWith('test');
        });

        it('should not write warning messages', () => {
            subject.warning('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('warning level', () => {
        beforeEach(() => {
            subject = new LoggingService(LogLevel.Warning);
        });

        it('should write debug messages', () => {
            subject.debug('test');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should write info messages', () => {
            subject.info('test');
            expect(console.info).not.toHaveBeenCalled();
        });

        it('should write warning messages', () => {
            subject.warning('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('error level', () => {
        beforeEach(() => {
            subject = new LoggingService(LogLevel.Error);
        });

        it('should not write debug messages', () => {
            subject.debug(error);
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should write info messages', () => {
            subject.info(error);
            expect(console.info).not.toHaveBeenCalled();
        });

        it('should write warning messages', () => {
            subject.warning(error);
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });
});
