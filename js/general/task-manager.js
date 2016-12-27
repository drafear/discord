"use strict";

exports.TaskManager = class {
    constructor(tasks) {
        this.tasks = tasks;
    }
    get task() {
        return this.tasks;
    }
    pause() {
        return Promise.all(this.tasks.map(task => task.pause()));
    }
    resume() {
        return Promise.all(this.tasks.map(task => task.resume()));
    }
};
