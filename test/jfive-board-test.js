import '../jfive-board.js';
const jsverify = require('jsverify');
const {ipcRenderer} = require('electron');
const johnnyFive = require('johnny-five');

class JFiveBoardTest extends HTMLElement {
    _beforeTest() {
        const fiveMock = {
            Board: td.constructor(johnnyFive.Board)
        };
        const jfiveBoard = document.createElement('jfive-board');
        jfiveBoard.five = fiveMock;
        jfiveBoard.require = function(name) {
            this.name = name;
        };
        this.appendChild(jfiveBoard);
        return jfiveBoard;
    }

    _afterTest(jfiveBoard) {
        this.removeChild(jfiveBoard);
    }

    prepareTests(test) {
        const arbBoardId = jsverify.nestring;
        const arbPort = jsverify.nestring;
        const arbRepl = jsverify.bool;
        const arbDebug = jsverify.bool;
        const arbTimeout = jsverify.nat;
        const arbIOPlugin = jsverify.string;

        test('check that the properties are all initialized correctly through plain attributes', [arbBoardId, arbPort, arbRepl, arbDebug, arbTimeout, arbIOPlugin], (boardId, port, repl, debug, timeout, ioPlugin) => {
            const jfiveBoard = this._beforeTest();

            jfiveBoard.setAttribute('board-id', boardId);
            jfiveBoard.setAttribute('port', port);
            jfiveBoard.setAttribute('repl-on', repl);
            jfiveBoard.setAttribute('debug', debug);
            jfiveBoard.setAttribute('timeout', timeout);
            jfiveBoard.setAttribute('io-plugin', ioPlugin);

            const result = jfiveBoard.boardId === boardId && jfiveBoard.port === port && jfiveBoard.replOn === repl && jfiveBoard.debug === debug && jfiveBoard.timeout === timeout && jfiveBoard.ioPlugin === ioPlugin;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('check that the properties are all initialized correctly through property binding or data-binding', [arbBoardId, arbPort, arbRepl, arbDebug, arbTimeout, arbIOPlugin], (boardId, port, repl, debug, timeout, ioPlugin) => {
            const jfiveBoard = this._beforeTest();

            jfiveBoard.boardId = boardId;
            jfiveBoard.port = port;
            jfiveBoard.replOn = repl;
            jfiveBoard.debug = debug;
            jfiveBoard.timeout = timeout;
            jfiveBoard.ioPlugin = ioPlugin;

            const result = jfiveBoard.boardId === boardId && jfiveBoard.port === port && jfiveBoard.replOn === repl && jfiveBoard.debug === debug && jfiveBoard.timeout === timeout && jfiveBoard.ioPlugin === ioPlugin;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('repl property should be true if the attribute is present or set to true through the attribute or through a property', [jsverify.bool, jsverify.bool], (trueOrEmpty, attributeOrProperty) => {
            const jfiveBoard = this._beforeTest();

            if (attributeOrProperty) {
                jfiveBoard.setAttribute('repl-on', trueOrEmpty ? 'true' : '');
            }
            else {
                jfiveBoard.replOn = true;
            }

            const result = jfiveBoard.replOn === true;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('repl property should be false if the attribute or property is set to false', [jsverify.bool], (attributeOrProperty) => {
            const jfiveBoard = this._beforeTest();

            if (attributeOrProperty) {
                jfiveBoard.setAttribute('repl-on', 'false');
            }
            else {
                jfiveBoard.replOn = false;
            }

            const result = jfiveBoard.replOn === false;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('repl property should be left unchanged if set to anything but true or false through an attribute', [jsverify.nestring], (randomString) => {
            const jfiveBoard = this._beforeTest();
            const originalRepl = jfiveBoard.repl;

            jfiveBoard.setAttribute('repl-on', randomString);

            const result = jfiveBoard.replOn === originalRepl;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('debug property should be true if the attribute is present or set to true through the attribute or through a property', [jsverify.bool, jsverify.bool], (trueOrEmpty, attributeOrProperty) => {
            const jfiveBoard = this._beforeTest();

            if (attributeOrProperty) {
                jfiveBoard.setAttribute('debug', trueOrEmpty ? 'true' : '');
            }
            else {
                jfiveBoard.debug = true;
            }

            const result = jfiveBoard.debug === true;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('debug property should be false if the attribute or property is set to false', [jsverify.bool], (attributeOrProperty) => {
            const jfiveBoard = this._beforeTest();

            if (attributeOrProperty) {
                jfiveBoard.setAttribute('debug', 'false');
            }
            else {
                jfiveBoard.debug = false;
            }

            const result = jfiveBoard.debug === false;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('debug property should be left unchanged if set to anything but true or false through an attribute', [jsverify.nestring], (randomString) => {
            const jfiveBoard = this._beforeTest();
            const originalDebug = jfiveBoard.debug;

            jfiveBoard.setAttribute('debug', randomString);

            const result = jfiveBoard.debug === originalDebug;
            this._afterTest(jfiveBoard);

            return result;
        });

        test('the board should initialize based on the initial properties', [arbBoardId, arbPort, arbRepl, arbDebug, arbTimeout, arbIOPlugin], (boardId, port, repl, debug, timeout, ioPlugin) => {
            const jfiveBoard = this._beforeTest();

            this.removeChild(jfiveBoard);

            jfiveBoard.boardId = boardId;
            jfiveBoard.port = port;
            jfiveBoard.replOn = repl;
            jfiveBoard.debug = debug;
            jfiveBoard.timeout = timeout;
            jfiveBoard.ioPlugin = ioPlugin;

            this.appendChild(jfiveBoard);

            td.verify(new jfiveBoard.five.Board({
                id: boardId,
                port,
                repl,
                debug,
                timeout,
                io: ioPlugin ? new jfiveBoard.require(ioPlugin) : undefined
            }));

            this._afterTest(jfiveBoard);

            return true;
        });

        test('event handlers should raise the correct custom events', [jsverify.elements(['connect', 'ready', 'exit', 'info', 'warn', 'fail', 'message'])], (eventName) => {
            const jfiveBoard = this._beforeTest();

            let customEvent;

            jfiveBoard.addEventListener(eventName, (event) => {
                customEvent = event;
            });

            jfiveBoard.Board[eventName]({
                eventName
            });

            const result = customEvent.type === eventName && customEvent.detail.eventName === eventName;
            this._afterTest(jfiveBoard);

            return result;
        });

        // this function builds a hierarchy of child nodes inside of a jfive-board component, emulating the structure of a real application
        // once the board is loaded into the DOM it should initialize all children by calling each child's boardReadyCallback
        test('static children should be initialized correctly', [jsverify.nat(5), jsverify.nat(5)], (numChildrenPerLevel, numLevels) => {
            const jfiveBoard = this._beforeTest();
            this.removeChild(jfiveBoard); // remove jfiveBoard from the DOM so that we can control when the connectedCallback is invoked
            const jfiveBoardWithChildren = createChildHierarchy(jfiveBoard, numChildrenPerLevel, numLevels);
            this.appendChild(jfiveBoardWithChildren); // invoke the connectedCallback so that we can test to make sure that all children have been initialized

            const result = allChildrenInitialized(jfiveBoardWithChildren);

            this._afterTest(jfiveBoardWithChildren);

            return result;

            function allChildrenInitialized(element) {
                const children = Array.from(element.children);
                if (children.length === 0) return true;

                const allInitialized = children.reduce((result, child) => {
                    if (!child.boardReadyCalled) return false;
                    return result;
                }, true);

                return allInitialized && children.reduce((result, child) => {
                    const allInitialized = allChildrenInitialized(child);
                    if (!allInitialized) return false;
                    return result;
                }, true);
            }

            function createChildHierarchy(element, numChildrenPerLevel, numLevels) {
                if (numLevels === 0) {
                    return element;
                }

                const children = new Array(numChildrenPerLevel).fill(null).map(() => {
                    const child = document.createElement('div');
                    child.boardReadyCallback = () => child.boardReadyCalled = true;
                    return child;
                });

                const newElement = children.reduce((result, child) => {
                    result.appendChild(child);
                    return result;
                }, element);

                //TODO I would like to figure out how to do this with a map or reduce or such, making it more functional/declarative/recursive
                children.forEach((child) => {
                    createChildHierarchy(child, numChildrenPerLevel, numLevels - 1);
                });

                return newElement;
            }
        });

        //TODO thing about static versus dynamic children...light DOM, local DOM, etc...is there a difference between statically declared children and children added dynamically to the DOM?
        //TODO we might not have to worry about dynamic children...actually, we should allow for dynamic children added to have their boardReadyCallbacks called
        // test('dynamic children should be initialized correctly', (assert) => {
        //     const result = jsverify.check(jsverify.forall(() => {
        //         return false;
        //     }), {
        //         tests: numTests
        //     });
        //
        //     assert.equal(result, true);
        //     assert.end();
        // });

        test('info method passes parameters to Board info', [jsverify.nestring, jsverify.nestring, jsverify.elements([1, 'test', {
            test: 5
        }])], (theClass, message, details) => {
            const jfiveBoard = this._beforeTest();

            // jfiveBoard.Board = td.object(jfiveBoard.Board);

            console.log(jfiveBoard.Board);

            jfiveBoard.info(theClass, message, ...details);
            const result = td.verify(jfiveBoard.Board.info(theClass, message, ...details));

            this._afterTest(jfiveBoard);

            return result;
        });
    }

}

window.customElements.define('jfive-board-test', JFiveBoardTest);
