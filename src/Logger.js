/*
 * (c) Kouichi Machida <k-machida@aideo.co.jp>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * ログ出力機能を提供します。
 */
export default class Logger {

    /**
     * 最後に使用したデフォルトのプレフィックスカラー番号を保持します。
     *
     * @type {number}
     */
    static lastUsePrefixColor = 0;

    /**
     * デフォルトで使用されるプレフィックスカラー。
     *
     * @type {string[]}
     */
    static prefixColors = [
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

    /**
     * 次に使用するデフォルトのプレフィックスカラーを取得します。
     *
     * @return {string} プレフィックスカラー。
     * @private
     */
    static _nextPrefixColor() {
        const prefixColor = Logger.prefixColors[Logger.lastUsePrefixColor % Logger.prefixColors.length];

        Logger.lastUsePrefixColor++;

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

        return {
            logger: logger,
            prefixColor: prefixColor
        };
    }

    /**
     * 設定内容を適用します。
     *
     * @private
     */
    _configure() {
        const {logger, prefixColor} = this._options;
        const noop = function () {

        };

        ['info', 'error', 'warn']
            .forEach((m) => {
                if (logger[m]) {
                    this[m] = logger[m].bind(logger, '%c%s%c', `color:${prefixColor};font-weight:bold;`, this._prefix, '');
                } else {
                    this[m] = noop;
                }
            });

        ['time', 'timeEnd']
            .forEach((m) => {
                if (logger[m]) {
                    this[m] = logger[m].bind(logger);
                } else {
                    this[m] = noop;
                }
            });
    }

}
