'use strict';

const g = {
    tasks: [
        require('./overwatch/main.js'),
        require('./bitbucket/main.js'),
    ],
};

const run = () => {
    g.tasks.forEach(task => {
        task.run();
    });
};

run();
