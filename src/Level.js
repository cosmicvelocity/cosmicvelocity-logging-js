/*
 * (c) Kouichi Machida <k-machida@aideo.co.jp>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

export default {

    DEBUG: 0,

    INFO: 1,

    WARN: 2,

    ERROR: 3,

    OFF: 9,

    fromString: function (s) {
        const key = s && s.toUpperCase();

        if (this[key]) {
            return this[key];
        } else {
            return 0;
        }
    }

}
