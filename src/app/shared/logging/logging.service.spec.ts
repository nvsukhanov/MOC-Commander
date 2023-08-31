/* eslint-disable no-console */
import { LogLevel } from 'rxpoweredup';

import { ConsoleLoggingService } from './console-logging.service';
import { IAppConfig } from '../i-app-config';

describe('LoggingService', () => {
    let subject: ConsoleLoggingService;
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
            subject = new ConsoleLoggingService({ logLevel: LogLevel.Debug } as IAppConfig);
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
            subject.warn('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('info level', () => {
        beforeEach(() => {
            subject = new ConsoleLoggingService({ logLevel: LogLevel.Info } as IAppConfig);
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
            subject.warn('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('warning level', () => {
        beforeEach(() => {
            subject = new ConsoleLoggingService({ logLevel: LogLevel.Warning } as IAppConfig);
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
            subject.warn('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should not write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('error level', () => {
        beforeEach(() => {
            subject = new ConsoleLoggingService({ logLevel: LogLevel.Error } as IAppConfig);
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
            subject.warn(error);
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should write error messages', () => {
            subject.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });
});
