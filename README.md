# logging-js
It is a lightweight logging library.

## Installation
Using npm:

```
    $ npm i -D @cosmicvelocity/logging-js
```

## How to use

```js
    import Logger from 'logging-js';

    class Sample {
        constructor() {
            this._logger = Logger.getLogger(this);
        }
        hello() {
            this._logger.info('Hello !!');
        }
    }

    const sample = new Sample();

    sample.hello();

    // [INFO] Sample Hello !!
```

## License
Apache 2.0
