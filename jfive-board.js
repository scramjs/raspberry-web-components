class JFiveBoard extends HTMLElement {
    constructor() {
        super();

        this.boardId;
        this.port;
        this.ioPlugin;
        this.replOn;
        this.debug;
        this.timeout;
        this.Board;
        this.five = require('johnny-five');
        this.require = require;
    }

    static get observedAttributes() {
        return [
            'board-id',
            'port',
            'repl-on',
            'debug',
            'timeout',
            'io-plugin'
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'board-id': {
                this.boardId = newValue;
                break;
            }
            case 'port': {
                this.port = newValue;
                break;
            }
            case 'repl-on': {
                this.replOn = newValue === '' || newValue === 'true' ? true : newValue === 'false' ? false : this.replOn;
                break;
            }
            case 'debug': {
                this.debug = newValue === '' || newValue === 'true' ? true : newValue === 'false' ? false : this.debug;
                break;
            }
            case 'timeout': {
                this.timeout = parseInt(newValue, 10);
                break;
            }
            case 'io-plugin': {
                this.ioPlugin = newValue;
                break;
            }
        }
    }

    get repl() {
        return this.Board.repl;
    }

    connectedCallback() {
        // initialize the board
        this.Board = new this.five.Board({
            id: this.boardId,
            port: this.port,
            repl: this.replOn,
            debug: this.debug,
            timeout: this.timeout,
            io: this.ioPlugin ? new this.require(this.ioPlugin) : undefined
        });

        // initialize all event handlers, pass the events up to the host element and no further
        this.Board.on('connect', (event) => {
            this.dispatchEvent(new CustomEvent('connect', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('ready', (event) => {
            this.dispatchEvent(new CustomEvent('ready', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('exit', (event) => {
            this.dispatchEvent(new CustomEvent('exit', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('info', (event) => {
            this.dispatchEvent(new CustomEvent('info', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('warn', (event) => {
            this.dispatchEvent(new CustomEvent('warn', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('fail', (event) => {
            this.dispatchEvent(new CustomEvent('fail', {
                detail: event,
                bubbles: false
            }));
        });

        this.Board.on('message', (event) => {
            this.dispatchEvent(new CustomEvent('message', {
                detail: event,
                bubbles: false
            }));
        });

        // initialize all children
        const _jfiveInitChildren = (element) => {
            const children = Array.from(element.children);
            children.forEach((child) => {
                if (child.boardReadyCallback) {
                    child.boardReadyCallback();

                    // Give the child this initChildren function so that it will initialize all of its children
                    child._jfiveInitChildren = _jfiveInitChildren;
                    child._jfiveInitChildren(child);
                }
            });
        };
        _jfiveInitChildren(this);
    }

    info() {
        // spreading the arguments here because Board.info has optional parameters
        this.Board.info(...arguments);
    }

    warn() {
        // spreading the arguments here because Board.warn has optional parameters
        this.Board.warn(...arguments);
    }

    fail() {
        this.Board.fail(...arguments);
    }

    pinMode(pin, mode) {
        this.Board.pinMode(pin, mode);
    }

    analogWrite(pin, value) {
        this.Board.analogWrite(pin, value);
    }

    analogRead(pin, handler) {
        this.Board.analogRead(pin, handler);
    }

    digitalWrite(pin, value) {
        this.Board.digitalWrite(pin, value);
    }

    digitalRead(pin, handler) {
        this.Board.digitalRead(pin, handler);
    }

    i2cConfig(millisecondsOrOptions) {
        this.Board.i2cConfig(millisecondsOrOptions);
    }

    i2cWrite() {
        // spreading the arguments here because Board.i2cWrite is overloaded (multiple method definitions that take different parameters)
        this.Board.i2cWrite(...arguments);
    }

    i2cWriteReg(address, register, byte) {
        this.Board.i2cWriteReg(address, register, byte);
    }

    i2cRead() {
        // spreading the arguments here because Board.i2cRead is overloaded (multiple method definitions that take different parameters)
        this.Board.i2cRead(...arguments);
    }

    i2cReadOnce() {
        // spreading the arguments here because Board.i2cReadOnce is overloaded (multiple method definitions that take different parameters)
        this.Board.i2cReadOnce(...arguments);
    }

    servoWrite(pin, angle) {
        this.Board.servoWrite(pin, angle);
    }

    shiftOut(dataPin, clockPin, isBigEndian, value) {
        this.Board.shiftOut(dataPin, clockPin, isBigEndian, value);
    }

    wait(milliseconds, handler) {
        this.Board.wait(milliseconds, handler);
    }

    loop(milliseconds, handler) {
        this.Board.loop(milliseconds, handler);
    }
}

window.customElements.define('jfive-board', JFiveBoard);
