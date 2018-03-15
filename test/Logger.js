"use strict";

import Level from '../src/Level';
import Logger from '../src/Logger';

describe('Logger', () => {
    const mock = {
        parameters: {}
    };

    ['log', 'info', 'error', 'warn', 'time', 'timeEnd']
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

    beforeEach(() => {
        mock.parameters = [];
    });

    describe('_options', () => {
        it('prefix', () => {
            expect(logger._prefix).toBe('Test');
        });

        it('default prefixColor', () => {
            expect(logger._options.prefixColor).toBe('#cc6666');
        });

        it('manual prefixColor', () => {
            const logger2 = new Logger('Test 2', {
                prefixColor: 'red'
            });

            expect(logger2._options.prefixColor).toBe('red');
        });
    });

    describe('log()', () => {
        it('log', () => {
            logger.log('Hello !!');

            expect(mock.parameters.log).toEqual(['[%s] %c%s%c', 'INFO', 'color:#cc6666;font-weight:bold;', 'Test', '', 'Hello !!']);
        });
    });

    describe('debug()', () => {
        beforeEach(() => {
            mock.parameters = [];
        });

        it('debug disabled', () => {
            logger.level = Level.OFF;
            logger.debug('Hello !!');

            expect(mock.parameters.log).toEqual(undefined);
        });

        it('debug enabled', () => {
            logger.level = Level.DEBUG;
            logger.debug('Hello !!');

            expect(mock.parameters.log).toEqual(['[%s] %c%s%c', 'DEBUG', 'color:#cc6666;font-weight:bold;', 'Test', '', 'Hello !!']);
        });
    });

    describe('info()', () => {
        beforeEach(() => {
            mock.parameters = [];
        });

        it('info disabled', () => {
            logger.level = Level.OFF;
            logger.info('Hello !!');

            expect(mock.parameters.info).toEqual(undefined);
        });

        it('info enabled', () => {
            logger.level = Level.INFO;
            logger.info('Hello !!');

            expect(mock.parameters.info).toEqual(['[%s] %c%s%c', 'INFO', 'color:#cc6666;font-weight:bold;', 'Test', '', 'Hello !!']);
        });
    });

    describe('warn()', () => {
        beforeEach(() => {
            mock.parameters = [];
        });

        it('warn disabled', () => {
            logger.level = Level.OFF;
            logger.warn('Warning !!');

            expect(mock.parameters.warn).toEqual(undefined);
        });

        it('warn enabled', () => {
            logger.level = Level.WARN;
            logger.warn('Warning !!');

            expect(mock.parameters.warn).toEqual(['[%s] %c%s%c', 'WARN', 'color:#cc6666;font-weight:bold;', 'Test', '', 'Warning !!']);
        });
    });

    describe('error()', () => {
        beforeEach(() => {
            mock.parameters = [];
        });

        it('error disabled', () => {
            logger.level = Level.OFF;
            logger.error('Error !!');

            expect(mock.parameters.error).toEqual(undefined);
        });

        it('error enabled', () => {
            logger.level = Level.ERROR;
            logger.error('Error !!');

            expect(mock.parameters.error).toEqual(['[%s] %c%s%c', 'ERROR', 'color:#cc6666;font-weight:bold;', 'Test', '', 'Error !!']);
        });
    });

    describe('time(), timeEnd()', () => {
        it('time, timeEnd', () => {
            logger.time('Test time');
            logger.timeEnd('Test time');

            expect(mock.parameters.time).toEqual(['Test time']);
            expect(mock.parameters.timeEnd).toEqual(['Test time']);
        });
    });
});
