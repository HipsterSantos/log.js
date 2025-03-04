// examples/usage.js

// ESM import (for direct usage in ESM projects)
import Logger from '@hipstersantos/colorful-logger';

// Helper to handle dynamic import for CommonJS or mixed contexts
async function getDynamicLogger(name, options) {
  const loggerModule = await Logger.dynamicImport(name, options);
  return loggerModule;
}

// 1. Basic Logger Instance (ESM)
// Hover in VSCode: Shows "[INFO] Server started successfully" with timestamp and caller info
const log = Logger.getLogger('ExampleApp');
log.info('Server started successfully');

// 2. Debug with Simple Metadata
// Hover: Displays "[DEBUG] Processing user request { userId: 123 }" in cyan
log.debug('Processing user request', { userId: 123 });

// 3. Warning with Resource Information
// Hover: Shows "[WARNING] System resource warning" with memory and cpu metadata
log.warning('System resource warning', { memory: '256MB', cpu: '80%' });

// 4. Error with Exception
// Hover: Shows "[ERROR] Database connection failed" with stack trace and fix suggestion
const dbError = new Error('Connection timeout');
log.error('Database connection failed', dbError);

// 5. Critical Error with Details
// Hover: Displays "[CRITICAL] Application crash detected" with reason and uptime
log.critical('Application crash detected', { reason: 'Out of Memory', uptime: '2h' });

// 6. Multiple Logger Instances
// Hover: Shows "[INFO] User login attempt initiated" under 'Authentication' logger
const authLog = Logger.getLogger('Authentication');
authLog.info('User login attempt initiated');

// 7. Logger without Timestamp
// Hover: Shows "[INFO] Operation completed without timestamp" (no timestamp due to config)
const noTimeLog = new Logger('NoTimestamp', { showTimestamp: false });
noTimeLog.info('Operation completed without timestamp');

// 8. Logger without Caller Info
// Hover: Displays "[DEBUG] Debug message without caller info" (no caller details)
const noCallerLog = new Logger('NoCaller', { showCaller: false });
noCallerLog.debug('Debug message without caller info');

// 9. Production Environment (Debug Suppressed)
// Hover on debug: Shows "Debug suppressed in production"; info shows normal output
const prodLog = new Logger('Production', { env: 'production' });
prodLog.debug('This debug message will not appear');
prodLog.info('Production info message');

// 10. Browser Detection
// Hover: Shows environment-specific "[INFO]" message based on runtime
if (typeof window !== 'undefined') {
    log.info('Running in browser environment');
} else {
    log.info('Running in Node.js environment');
}

// 11. Complex Object as Metadata
// Hover: Displays "[INFO]" with nested user object in metadata
log.info('User profile update', { user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' } });

// 12. Multiple Metadata Fields
// Hover: Shows "[WARNING]" with limit, current, and timeLeft details
log.warning('API limits approaching', { limit: 1000, current: 995, timeLeft: '5min' });

// 13. Error with Custom Metadata
// Hover: Displays "[ERROR]" with field, value, rule, and suggested fix
log.error('Form validation failed', { field: 'username', value: 'invalid@name', rule: 'alphanumeric' });

// 14. Nested Metadata for Browser Grouping
// Hover: Shows "[INFO]" with nested step and details object
log.info('Multi-step process', { step: 2, details: { status: 'pending', progress: '50%' } });

// 15. Simulate Uncaught Exception
// Hover: Shows "[ERROR]" when triggered, with stack trace in tooltip
setTimeout(() => {
    throw new Error('Simulated uncaught exception');
}, 1000);

// 16. Simulate Unhandled Promise Rejection
// Hover: Shows "[WARNING]" for promise rejection with reason
Promise.reject('Simulated promise rejection');

// 17. Long Message Test
// Hover: Displays full "[INFO]" message, truncated in tooltip for readability
log.info('This is a very long message to test how the logger handles wrapping and formatting in the console output across multiple lines if necessary');

// 18. Multiple Loggers in Action
// Hover: Shows separate "[INFO]" outputs for 'Payment' and 'ExampleApp'
const paymentLog = Logger.getLogger('Payment');
paymentLog.info('Processing payment');
log.info('Main application continues running');

// 19. Custom Stack Trace
// Hover: Displays "[ERROR]" with manual stack trace in tooltip
log.error('Manual stack trace', { stack: log.getFullStack() });

// 20. Conditional Logging
// Hover: Shows "[DEBUG]" only if verboseMode is true
const verboseMode = true;
if (verboseMode) {
    log.debug('Verbose mode enabled, showing detailed logs');
}

// 21. Custom Configuration Override
// Hover: Shows "[INFO]" with caller info but no timestamp
const customLog = new Logger('Custom', { showTimestamp: false, showCaller: true });
customLog.info('Custom logger with caller info only');

// 22. Error with Mixed Context
// Hover: Displays "[ERROR]" with status, retryAttempts, and error stack
log.error('Service failure', { 
    status: 503, 
    retryAttempts: 3, 
    error: new Error('Service unavailable') 
});

// 23. Logging with Array Metadata
// Hover: Shows "[INFO]" with items array and duration
log.info('Batch operation completed', { items: [1, 2, 3, 4, 5], duration: '200ms' });

// 24. Warning with Timestamp Only
// Hover: Displays "[WARNING]" with timestamp but no caller info
const timeOnlyLog = new Logger('TimeOnly', { showCaller: false });
timeOnlyLog.warning('Operation took longer than expected');

// 25. Debug with Empty Metadata
// Hover: Shows "[DEBUG]" with no metadata details
log.debug('Simple debug log', {});

// 26. Dynamic Import Example (CommonJS Simulation)
// Hover: Shows "[INFO]" after dynamic import resolves
(async () => {
    const dynamicLog = await getDynamicLogger('DynamicExample');
    dynamicLog.info('Logger loaded dynamically');
})();

// 27. Module Type Detection
// Hover: Displays "[DEBUG]" with detected module type
log.debug('Module environment', { type: typeof require === 'undefined' ? 'ESM' : 'CommonJS' });

// 28. Null Metadata
// Hover: Shows "[INFO]" with null metadata
log.info('Null metadata test', null);

// 29. Undefined Metadata
// Hover: Displays "[DEBUG]" with undefined metadata
log.debug('Undefined metadata test', undefined);

// 30. Empty String Message
// Hover: Shows "[WARNING]" with empty message
log.warning('');

// 31. Special Characters
// Hover: Displays "[INFO]" with special characters in metadata
log.info('Special characters', { value: '!@#$%^&*' });

// 32. Large Data Object
// Hover: Shows "[DEBUG]" with large array truncated in tooltip
log.debug('Large data', { array: Array(50).fill('x') });

// 33. Loop Logging
// Hover: Displays "[INFO]" for each iteration
for (let i = 0; i < 3; i++) {
    log.info(`Loop iteration ${i}`);
}

// 34. Async Operation Logging
// Hover: Shows "[DEBUG]" then "[INFO]" after async completes
async function asyncOperation() {
    log.debug('Async start');
    await new Promise(resolve => setTimeout(resolve, 500));
    log.info('Async complete');
}
asyncOperation();

// 35. Random Data Logging
// Hover: Displays "[INFO]" with random number
log.info('Random value', { number: Math.random() });

// 36. High-Frequency Logging
// Hover: Shows "[INFO]" for each tick (up to 5)
let count = 0;
const interval = setInterval(() => {
    if (count++ < 5) log.info('Tick');
    else clearInterval(interval);
}, 200);

// 37. Browser-Specific Window Info
// Hover: Displays "[DEBUG]" with window dimensions if in browser
if (typeof window !== 'undefined') {
    log.debug('Window info', { width: window.innerWidth, height: window.innerHeight });
}

// 38. Event Listener Logging
// Hover: Shows "[INFO]" when event triggers in browser
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => log.info('User clicked'));
}

// 39. Node-Specific Process Info
// Hover: Displays "[INFO]" with Node process details
if (typeof process !== 'undefined') {
    log.info('Node process', { pid: process.pid, version: process.version });
}

// 40. API Call Simulation
// Hover: Shows "[INFO]" for start and finish of simulated API call
async function simulateApiCall() {
    log.info('API call starting');
    await new Promise(resolve => setTimeout(resolve, 300));
    log.info('API call finished');
}
simulateApiCall();

// 41. Database Query Logging
// Hover: Displays "[DEBUG]" with SQL query
log.debug('Query executed', { sql: 'SELECT * FROM users' });

// 42. File Operation Logging
// Hover: Shows "[INFO]" with file path
log.info('File read', { path: './config.json' });

// 43. User Action Logging
// Hover: Displays "[INFO]" with button ID
log.info('Button clicked', { buttonId: 'submit' });

// 44. Session Logging
// Hover: Shows "[INFO]" with session ID
log.info('Session started', { sessionId: 'xyz789' });

// 45. Performance Test - Bulk Logging
// Hover: Displays "[DEBUG]" for each bulk log
for (let i = 0; i < 10; i++) {
    log.debug(`Bulk log ${i}`);
}

// 46. Custom Logger with Dynamic Import
// Hover: Shows "[INFO]" after dynamic import, no timestamp
(async () => {
    const dynCustom = await getDynamicLogger('DynamicCustom', { showTimestamp: false });
    dynCustom.info('Dynamic custom logger');
})();

// 47. Error with No Stack
// Hover: Displays "[ERROR]" with message, no stack trace
log.error('Simple error', { message: 'No stack provided' });

// 48. Warning with Nested Object
// Hover: Shows "[WARNING]" with nested config object
log.warning('Complex warning', { config: { retries: 3, delay: { ms: 500 } } });

// 49. Browser Group Collapse Test
// Hover: Displays "[INFO]" with collapsible group metadata
log.info('Browser group', { step: 1, details: { ok: true, value: 42 } });

// 50. Production Dynamic Import
// Hover: Shows "[INFO]" only (debug suppressed in production)
(async () => {
    const prodDynamic = await getDynamicLogger('ProdDynamic', { env: 'production' });
    prodDynamic.debug('This won’t show in production');
    prodDynamic.info('Production dynamic log');
})();

// 51. Mixed Context with Array and Error
// Hover: Displays "[ERROR]" with array and error stack
log.error('Mixed failure', { codes: [400, 401], error: new Error('Auth failed') });

// 52. Startup Sequence
// Hover: Shows "[INFO]" with phase and timestamp
log.info('App startup sequence', { phase: 'init', time: Date.now() });

// --- VSCode Extension-Specific Examples ---

// 53. VSCode Hover Preview - Basic Info
// Hover: Shows "[INFO] VSCode extension in action" with tooltip preview
log.info('VSCode extension in action', { feature: 'hover preview' });

// 54. VSCode Error Diagnostic
// Hover: Displays "[ERROR]" with stack and try-catch suggestion
log.error('Extension error test', new Error('Sample error for VSCode'));

// 55. VSCode Debug with Metadata
// Hover: Shows "[DEBUG]" with metadata in tooltip
log.debug('Debugging in VSCode', { tool: 'Colorful Logger Helper' });

// 56. VSCode Warning with Suggestion
// Hover: Displays "[WARNING]" with metadata and no fix suggestion
log.warning('Potential issue in VSCode', { risk: 'low memory' });

// 57. VSCode Critical with Stack
// Hover: Shows "[CRITICAL]" with stack trace and fix suggestion
log.critical('Critical VSCode issue', { error: new Error('Critical failure') });

// 58. VSCode Multiple Loggers
// Hover: Shows "[INFO]" for 'Editor' logger in tooltip
const editorLog = Logger.getLogger('Editor');
editorLog.info('Editor logger active in VSCode');

// 59. VSCode Dynamic Import with Extension
// Hover: Shows "[INFO]" after dynamic import, visible in tooltip
(async () => {
    const vscodeDynamic = await getDynamicLogger('VSCDynamic');
    vscodeDynamic.info('Dynamic logger in VSCode');
})();

// 60. VSCode Conditional Error
// Hover: Shows "[ERROR]" with condition-based output and fix suggestion
const hasError = true;
if (hasError) {
    log.error('Conditional error in VSCode', { cause: 'test condition' });
}

// Run the script if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    console.log('Running usage examples...');
    // All examples above will execute
}