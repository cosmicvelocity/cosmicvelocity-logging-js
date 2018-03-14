/*
 * (c) Kouichi Machida <k-machida@aideo.co.jp>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import Level from './Level';

/**
 * ログ出力機能を提供します。
 */
export default class Logger {

    /**
     * 最後に使用したデフォルトのプレフィックスカラー番号を保持します。
     *
     * @type {number}
     */
    static _lastUsePrefixColor = 0;

    /**
     * デフォルトで使用されるプレフィックスカラー。
     *
     * @type {string[]}
     */
    static _prefixColors = [
        '#F2777A',
        '#F99157',
        '#FFCC66',
        '#99CC99',
        '#66CCCC',
        '#6699CC',
        '#CC99CC'
    ];

    /**
     * Logger を初期化します。
     *
     * @param {string} prefix プレフィックス。
     * @param {{}} options オプション。
     */
    constructor(prefix, options = {}) {
        this._prefix = prefix;
        this._options = Logger._normalizeOptions(options);

        this._configure();
    }

    get level() {
        return this._options.level;
    }

    set level(level) {
        this._options.level = level;

        this._configure();
    }

    /**
     * 次に使用するデフォルトのプレフィックスカラーを取得します。
     *
     * @return {string} プレフィックスカラー。
     * @private
     */
    static _nextPrefixColor() {
        const prefixColor = Logger._prefixColors[Logger._lastUsePrefixColor % Logger._prefixColors.length];

        Logger._lastUsePrefixColor++;

        return prefixColor;
    }

    /**
     * オプション内容を正規化します。
     *
     * @param {{}} options オプション。
     * @return {{logger: {}, prefixColor: string}} 正規化された設定内容。
     * @private
     */
    static _normalizeOptions(options) {
        const logger = options.logger || console;
        const prefixColor = options.prefixColor || Logger._nextPrefixColor();
        const level = options.level || Level.INFO;

        return {
            logger: logger,
            prefixColor: prefixColor,
            level: level
        };
    }

    /**
     * 設定内容を適用します。
     *
     * @private
     */
    _configure() {
        const {logger, prefixColor, level} = this._options;
        const noop = function () {};
        const style = `color:${prefixColor};font-weight:bold;`;

        ['log']
            .forEach((m) => {
                if (logger[m]) {
                    this[m] = logger[m].bind(logger, '%c%s%c', style, this._prefix, '');
                } else {
                    this[m] = noop;
                }
            });

        ['debug']
            .forEach((m) => {
                const lv = Level.fromString(m);

                if (logger['log'] && (level <= lv)) {
                    this[m] = logger['log'].bind(logger, '[%s] %c%s%c', m.toUpperCase(), style, this._prefix, '');
                } else {
                    this[m] = noop;
                }
            });

        ['info', 'warn', 'error']
            .forEach((m) => {
                const lv = Level.fromString(m);

                if (logger[m] && (level <= lv)) {
                    this[m] = logger[m].bind(logger, '[%s] %c%s%c', m.toUpperCase(), style, this._prefix, '');
                } else {
                    this[m] = noop;
                }
            });

        ['trace']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : noop;
            });

        ['dir', 'table']
            .forEach((m) => {
                if (logger[m]) {
                    this[m] = logger[m].bind(logger);
                } else if (logger['log']) {
                    this[m] = logger['log'].bind(logger);
                } else {
                    this[m] = noop;
                }
            });

        ['group', 'groupCollapsed', 'groupEnd']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : noop;
            });

        ['time', 'timeEnd']
            .forEach((m) => {
                this[m] = (logger[m]) ? logger[m].bind(logger) : noop;
            });
    }

}
