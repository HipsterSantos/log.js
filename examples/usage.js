// examples/usage.js
import Logger from '../src/logger.js';

// 1. Basic Logger Instance
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

// Run the script if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    console.log('Running usage examples...');
    // All examples above will execute
}