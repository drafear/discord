'use strict';

const g = {
    eventEmitter: require('events'),
};
const EventEmitter = require('events');

class Pauser extends EventEmitter {
    constructor() {
        super();
        this.pausing = null;
        this._main = null;
        this.is_busy = false;
    }
    set_main(main_func) {
        this._main = () => {
            if ("then" in main_func) {
                return main_func;
            }
            else {
                return Promise.resolve(main_func());
            }
        };
    }
    main() {
        this._wait().then
        this.is_busy = true;
        return this._main().then(() => {
            this.is_busy = false;
        });
    }
    _wait() {
        if (this.pausing) {
            this.emit("paused");
            return this.pausing;
        }
        return Promise.resolve();
    }
    pause() {
        this.pausing = new Promise((resolve, reject) => {
            this.once("resume", () => {
                this.pausing = null;
                resolve();
            });
        });
        return new Promise((resolve, reject) => {
            if (!this.is_busy) {
                resolve();
                return;
            }
            this.once("paused", () => {
                resolve();
            });
        });
    }
    resume() {
        this.emit("resume");
    }
};
exports.Pauser = Pauser;
