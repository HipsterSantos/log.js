// examples/usage.js

// ESM import (for direct usage in ESM projects)
import Logger from '../src/logger.js';

// Helper to handle dynamic import for CommonJS or mixed contexts
async function getDynamicLogger(name, options) {
  const loggerModule = await Logger.dynamicImport(name, options);
  return loggerModule;
}

// 1. Basic Logger Instance (ESM)
const log = Logger.getLogger('ExampleApp');
log.info('Server started successfully');

// 2. Debug with Simple Metadata
log.debug('Processing user request', { userId: 123 });

// 3. Warning with Resource Information
log.warning('System resource warning', { memory: '256MB', cpu: '80%' });

// 4. Error with Exception
const dbError = new Error('Connection timeout');
log.error('Database connection failed', dbError);

// 5. Critical Error with Details
log.critical('Application crash detected', { reason: 'Out of Memory', uptime: '2h' });

// 6. Multiple Logger Instances
const authLog = Logger.getLogger('Authentication');
authLog.info('User login attempt initiated');

// 7. Logger without Timestamp
const noTimeLog = new Logger('NoTimestamp', { showTimestamp: false });
noTimeLog.info('Operation completed without timestamp');

// 8. Logger without Caller Info
const noCallerLog = new Logger('NoCaller', { showCaller: false });
noCallerLog.debug('Debug message without caller info');

// 9. Production Environment (Debug Suppressed)
const prodLog = new Logger('Production', { env: 'production' });
prodLog.debug('This debug message will not appear');
prodLog.info('Production info message');

// 10. Browser Detection
if (typeof window !== 'undefined') {
    log.info('Running in browser environment');
} else {
    log.info('Running in Node.js environment');
}

// 11. Complex Object as Metadata
log.info('User profile update', { user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' } });

// 12. Multiple Metadata Fields
log.warning('API limits approaching', { limit: 1000, current: 995, timeLeft: '5min' });

// 13. Error with Custom Metadata
log.error('Form validation failed', { field: 'username', value: 'invalid@name', rule: 'alphanumeric' });

// 14. Nested Metadata for Browser Grouping
log.info('Multi-step process', { step: 2, details: { status: 'pending', progress: '50%' } });

// 15. Simulate Uncaught Exception
setTimeout(() => {
    throw new Error('Simulated uncaught exception');
}, 1000);

// 16. Simulate Unhandled Promise Rejection
Promise.reject('Simulated promise rejection');

// 17. Long Message Test
log.info('This is a very long message to test how the logger handles wrapping and formatting in the console output across multiple lines if necessary');

// 18. Multiple Loggers in Action
const paymentLog = Logger.getLogger('Payment');
paymentLog.info('Processing payment');
log.info('Main application continues running');

// 19. Custom Stack Trace
log.error('Manual stack trace', { stack: log.getFullStack() });

// 20. Conditional Logging
const verboseMode = true;
if (verboseMode) {
    log.debug('Verbose mode enabled, showing detailed logs');
}

// 21. Custom Configuration Override
const customLog = new Logger('Custom', { showTimestamp: false, showCaller: true });
customLog.info('Custom logger with caller info only');

// 22. Error with Mixed Context
log.error('Service failure', { 
    status: 503, 
    retryAttempts: 3, 
    error: new Error('Service unavailable') 
});

// 23. Logging with Array Metadata
log.info('Batch operation completed', { items: [1, 2, 3, 4, 5], duration: '200ms' });

// 24. Warning with Timestamp Only
const timeOnlyLog = new Logger('TimeOnly', { showCaller: false });
timeOnlyLog.warning('Operation took longer than expected');

// 25. Debug with Empty Metadata
log.debug('Simple debug log', {});

// 26. Dynamic Import Example (CommonJS Simulation)
(async () => {
    const dynamicLog = await getDynamicLogger('DynamicExample');
    dynamicLog.info('Logger loaded dynamically');
})();

// 27. Module Type Detection
log.debug('Module environment', { type: typeof require === 'undefined' ? 'ESM' : 'CommonJS' });

// 28. Null Metadata
log.info('Null metadata test', null);

// 29. Undefined Metadata
log.debug('Undefined metadata test', undefined);

// 30. Empty String Message
log.warning('');

// 31. Special Characters
log.info('Special characters', { value: '!@#$%^&*' });

// 32. Large Data Object
log.debug('Large data', { array: Array(50).fill('x') });

// 33. Loop Logging
for (let i = 0; i < 3; i++) {
    log.info(`Loop iteration ${i}`);
}

// 34. Async Operation Logging
async function asyncOperation() {
    log.debug('Async start');
    await new Promise(resolve => setTimeout(resolve, 500));
    log.info('Async complete');
}
asyncOperation();

// 35. Random Data Logging
log.info('Random value', { number: Math.random() });

// 36. High-Frequency Logging
let count = 0;
const interval = setInterval(() => {
    if (count++ < 5) log.info('Tick');
    else clearInterval(interval);
}, 200);

// 37. Browser-Specific Window Info
if (typeof window !== 'undefined') {
    log.debug('Window info', { width: window.innerWidth, height: window.innerHeight });
}

// 38. Event Listener Logging
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => log.info('User clicked'));
}

// 39. Node-Specific Process Info
if (typeof process !== 'undefined') {
    log.info('Node process', { pid: process.pid, version: process.version });
}

// 40. API Call Simulation
async function simulateApiCall() {
    log.info('API call starting');
    await new Promise(resolve => setTimeout(resolve, 300));
    log.info('API call finished');
}
simulateApiCall();

// 41. Database Query Logging
log.debug('Query executed', { sql: 'SELECT * FROM users' });

// 42. File Operation Logging
log.info('File read', { path: './config.json' });

// 43. User Action Logging
log.info('Button clicked', { buttonId: 'submit' });

// 44. Session Logging
log.info('Session started', { sessionId: 'xyz789' });

// 45. Performance Test - Bulk Logging
for (let i = 0; i < 10; i++) {
    log.debug(`Bulk log ${i}`);
}

// 46. Custom Logger with Dynamic Import
(async () => {
    const dynCustom = await getDynamicLogger('DynamicCustom', { showTimestamp: false });
    dynCustom.info('Dynamic custom logger');
})();

// 47. Error with No Stack
log.error('Simple error', { message: 'No stack provided' });

// 48. Warning with Nested Object
log.warning('Complex warning', { config: { retries: 3, delay: { ms: 500 } } });

// 49. Browser Group Collapse Test
log.info('Browser group', { step: 1, details: { ok: true, value: 42 } });

// 50. Production Dynamic Import
(async () => {
    const prodDynamic = await getDynamicLogger('ProdDynamic', { env: 'production' });
    prodDynamic.debug('This won’t show in production');
    prodDynamic.info('Production dynamic log');
})();

// 51. Mixed Context with Array and Error
log.error('Mixed failure', { codes: [400, 401], error: new Error('Auth failed') });

// 52. Startup Sequence
log.info('App startup sequence', { phase: 'init', time: Date.now() });

// Run the script if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    console.log('Running usage examples...');
    // All examples above will execute
}