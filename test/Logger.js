"use strict";

import Logger from '../src/Logger';

describe('Logger', () => {
    const mock = {
        parameters: {}
    };

    ['info', 'error', 'warn', 'time', 'timeEnd']
        .forEach(function (m) {
            mock[m] = function () {
                mock.parameters[m] = [];

                for (let i = 0; i < arguments.length; i++) {
                    mock.parameters[m].push(arguments[i]);
                }
            };
        });

    const logger = new Logger('Test', {
        logger: mock
    });

    it('options', () => {
        expect(logger._prefix).toBe('Test');
        expect(logger._options.prefixColor).toBe('#F2777A');
    });

    it('info', () => {
        logger.info('Hello !!');

        expect(mock.parameters.info).toEqual(['%c%s%c', 'color:#F2777A;font-weight:bold;', 'Test', '', 'Hello !!']);
    });

    it('error', () => {
        logger.error('Error !!');

        expect(mock.parameters.error).toEqual(['%c%s%c', 'color:#F2777A;font-weight:bold;', 'Test', '', 'Error !!']);
    });

    it('warn', () => {
        logger.warn('Warning !!');

        expect(mock.parameters.warn).toEqual(['%c%s%c', 'color:#F2777A;font-weight:bold;', 'Test', '', 'Warning !!']);
    });

    it('time, timeEnd', () => {
        logger.time('Test time');
        logger.timeEnd('Test time');

        expect(mock.parameters.time).toEqual(['Test time']);
        expect(mock.parameters.timeEnd).toEqual(['Test time']);
    });
});
