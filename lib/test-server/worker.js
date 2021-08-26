// file myWorker.js
const workerpool = require('workerpool');

function eventExample(delay) {
    workerpool.workerEmit({
        status: 'in_progress',
        delay: delay
    });

    console.log("hey your delay", delay)

    workerpool.workerEmit({
        status: 'complete',
        delay: delay
    });
    return true;
}

// create a worker and register functions
workerpool.worker({
    eventExample: eventExample
});