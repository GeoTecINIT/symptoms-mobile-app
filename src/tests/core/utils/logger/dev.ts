import { DevLogger } from '~/app/core/utils/logger/dev';

describe('Dev logger', () => {
    const tag = 'LogTag';
    const consoleMock = createConsoleMock();
    const logger = new DevLogger(tag, consoleMock);

    it('emits a debug log', () => {
        spyOn(consoleMock, 'debug');
        logger.debug('Debug message');
        expect(consoleMock.debug).toHaveBeenCalledWith(
            '[DEBUG] LogTag: Debug message'
        );
    });

    it('emits an info log', () => {
        spyOn(consoleMock, 'info');
        logger.info('Info message');
        expect(consoleMock.info).toHaveBeenCalledWith(
            '[INFO] LogTag: Info message'
        );
    });

    it('emits a warning log', () => {
        spyOn(consoleMock, 'warn');
        logger.warn('Warning message');
        expect(consoleMock.warn).toHaveBeenCalledWith(
            '[WARN] LogTag: Warning message'
        );
    });

    it('emits an error log', () => {
        spyOn(consoleMock, 'error');
        logger.error('Error message');
        expect(consoleMock.error).toHaveBeenCalledWith(
            '[ERROR] LogTag: Error message'
        );
    });
});

function createConsoleMock(): Console {
    const console = {
        debug(message?: any, ...optionalParams: Array<any>) {
            return null;
        },
        info(message?: any, ...optionalParams: Array<any>) {
            return null;
        },
        warn(message?: any, ...optionalParams: Array<any>) {
            return null;
        },
        error(message?: any, ...optionalParams: Array<any>) {
            return null;
        }
    };

    return console as Console;
}
