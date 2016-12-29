"use strict";

exports.TaskManager = class {
    constructor(tasks) {
        this.tasks = tasks;
    }
    task(name) {
        for (const task of this.tasks) {
            if (task.name === name) {
                return task.task;
            }
        }
        return null;
    }
    pause() {
        return Promise.all(this.tasks.map(task => task.task.pause()));
    }
    resume() {
        return Promise.all(this.tasks.map(task => task.task.resume()));
    }
};
