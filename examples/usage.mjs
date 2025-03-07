// examples/usage.mjs
import Logger from "../src/logger.js";

let logg = new Logger('testing');
logg.info('Im starting here');

async function getDynamicLogger(name, options) {
    const loggerModule = await Logger.dynamicImport(name, options);
    return loggerModule;
}

const log = Logger.getLogger('ExampleApp');
log.info('Server started successfully');

log.debug('Processing user request', { userId: 123 });
log.warning('System resource warning', { memory: '256MB', cpu: '80%' });

const dbError = new Error('Connection timeout');
log.error('Database connection failed', dbError);

log.critical('Application crash detected', { reason: 'Out of Memory', uptime: '2h' });

// High-frequency logging with cleanup
let count = 0;
const interval = setInterval(() => {
    if (count++ < 5) log.info('Tick');
    else {
        clearInterval(interval);
        log.info('Interval cleared to prevent memory leak');
    }
}, 200);

// Async operation
async function asyncOperation() {
    log.debug('Async start');
    await new Promise(resolve => setTimeout(resolve, 500));
    log.info('Async complete');
}
asyncOperation();

// Null metadata test
log.info('Null metadata test', null);

// Cleanup
setTimeout(() => {
    log.info('Cleaning up logger instance');
    log.destroy();
}, 2000);