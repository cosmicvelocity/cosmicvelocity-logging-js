/*
 * (c) Kouichi Machida <k-machida@aideo.co.jp>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import Level from './Level';

/**
 * Provide log output function.
 */
export default class Logger {
    /**
     * The default prefix color index used last.
     *
     * @type {number}
     */
    static _lastUsePrefixColor = 0;

    /**
     * The prefix color to be used by default.
     *
     * Tomorrow Theme (tomorrow-night)
     * https://github.com/chriskempson/tomorrow-theme#tomorrow-night
     *
     * @type {string[]}
     */
    static _prefixColors = [
        '#cc6666',
        '#de935f',
        '#f0c674',
        '#b5bd68',
        '#8abeb7',
        '#81a2be',
        '#b294bb'
    ];

    /**
     * Initialize the Logger.
     *
     * @param {string} prefix Prefix.
     * @param {{logger: {}, prefixColor: string, level: string, refreshLevelInterval: number}} options option.
     *      logger: Objects that actually output logs (such as console).
     *      prefixColor: The color of the prefix.
     *      level: A string representing the log level (for example, DEBUG).
     *      refreshLevelInterval: Interval at which the log level is refreshed.
     */
    constructor(prefix, options = {}) {
        this._prefix = prefix;
        this._refreshLevelIntervalId = -1;
        this._options = Logger._normalizeOptions(options);

        this._apply();
    }

    /**
     * Gets the log level.
     *
     * @return {string} A string representing the log level.
     */
    get level() {
        return this._options.level;
    }

    /**
     * Set the log level.
     *
     * @param {string} level New log level.
     */
    set level(level) {
        this._options.level = level;

        this._apply();
    }

    /**
     * Get the default prefix color to use next.
     *
     * @return {string} Prefix color.
     * @private
     */
    static _nextPrefixColor() {
        const prefixColor = Logger._prefixColors[Logger._lastUsePrefixColor % Logger._prefixColors.length];

        Logger._lastUsePrefixColor++;

        return prefixColor;
    }

    /**
     * do nothing
     *
     * @private
     */
    static _noop() {
        //
    }

    /**
     * Normalize options.
     *
     * @param {{}} options option.
     * @return {{logger: {}, prefixColor: string, level: string, refreshLevelInterval: number}} Normalized options.
     * @private
     */
    static _normalizeOptions(options) {
        const debug = options.debug || false;
        const logger = options.logger || console;
        const prefixColor = options.prefixColor || Logger._nextPrefixColor();
        const level = options.level || Level.INFO;
        const refreshLevelInterval = options.refreshLevelInterval || 0;

        return {
            debug: debug,
            logger: logger,
            prefixColor: prefixColor,
            level: level,
            refreshLevelInterval: refreshLevelInterval
        };
    }

    /**
     * Apply the options.
     *
     * @private
     */
    _apply() {
        const { debug, logger, prefixColor, level, refreshLevelInterval } = this._options;
        const style = `color:${prefixColor};font-weight:bold;`;
        const ua = navigator.userAgent;
        const isColorSupport = /firefox/i.test(ua) ||
            (/applewebkit/i.test(ua) && !/edge/i.test(ua));
        const format = isColorSupport ? '[%s] %c%s%c' : '[%s] %s';
        const args = isColorSupport
            ? [format, '', style, this._prefix, '']
            : [format, '', this._prefix];

        ['log']
            .forEach((m) => {
                if (logger[m]) {
                    args[1] = 'INFO';

                    this[m] = logger['log'].bind(logger, ...args);
                } else {
                    this[m] = Logger._noop;
                }
            });

        ['debug']
            .forEach((m) => {
                const lv = Level.fromString(m);

                if (logger['log'] && (level <= lv)) {
                    args[1] = m.toUpperCase();

                    this[m] = logger['log'].bind(logger, ...args);
                } else {
                    this[m] = Logger._noop;
                }
            });

        ['info', 'warn', 'error']
            .forEach((m) => {
                const lv = Level.fromString(m);

                if (logger[m] && (level <= lv)) {
                    args[1] = m.toUpperCase();

                    this[m] = logger[m].bind(logger, ...args);
                } else {
                    this[m] = Logger._noop;
                }
            });

        ['trace']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : Logger._noop;
            });

        ['dir', 'dirxml', 'table']
            .forEach((m) => {
                if (logger[m]) {
                    this[m] = logger[m].bind(logger);
                } else if (logger['log']) {
                    this[m] = logger['log'].bind(logger);
                } else {
                    this[m] = Logger._noop;
                }
            });

        ['assert', 'clear']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : Logger._noop;
            });

        ['group', 'groupCollapsed']
            .forEach((m) => {
                if (logger[m]) {
                    args[1] = 'INFO';

                    this[m] = logger[m].bind(logger, ...args);
                } else {
                    this[m] = Logger._noop;
                }
            });

        ['groupEnd']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : Logger._noop;
            });

        ['time', 'timeEnd']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : Logger._noop;
            });

        if (this._refreshLevelIntervalId !== -1) {
            debug && this.debug('Releases the log level refresh timer.');

            clearInterval(this._refreshLevelIntervalId);

            this._refreshLevelIntervalId = -1;
        }

        if (0 !== refreshLevelInterval) {
            debug && this.debug('Sets the log level refresh timer.');

            this._refreshLevelIntervalId = setInterval(() => {
                const level = localStorage.getItem('debug');

                if (this.level !== level) {
                    this.level = level;
                }
            }, refreshLevelInterval);
        }
    }

}
