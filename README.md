log.js
colorful-logger

A feature-rich, colorful logging library for Node.js and browser environments.

Installation

npm install colorful-logger

Basic Usage

import Logger from 'logger';
// or
const Logger = require('colorful-logger');

const logger = Logger.getLogger('MyApp');
logger.info('Hello World!');

Features

- Color-coded log levels
- Stack tracing
- Customizable options
- Browser and Node.js support
- Error monitoring
- Metadata support

Configuration Options

const logger = new Logger('App', {
    showTimestamp: true,
    showCaller: true,
    env: 'development',
    exitOnError: true,
    suppressBrowserErrors: false
});

Usage Examples

1. Basic logging
log.info('Server started');

2. Debug with metadata
log.debug('Processing request', { userId: 123 });

3. Warning with custom data
log.warning('Resource low', { memory: '256MB' });

4. Error with stack trace
log.error('Database connection failed', new Error('Connection timeout'));

5. Critical error
log.critical('System crash', { reason: 'OOM' });

6. Custom logger name
const dbLog = Logger.getLogger('Database');
dbLog.info('Query executed');

7. No timestamp
const noTimeLog = new Logger('NoTime', { showTimestamp: false });
noTimeLog.info('Quick log');

8. No caller info
const noCallerLog = new Logger('NoCaller', { showCaller: false });
noCallerLog.debug('Simple debug');

9. Production mode (no debug logs)
const prodLog = new Logger('Prod', { env: 'production' });
prodLog.debug('This won’t show');
prodLog.info('This will show');

10. Browser-specific
if (typeof window !== 'undefined') {
    log.info('Running in browser');
}

11. With object metadata
log.info('User login', { user: { id: 1, name: 'John' } });

12. Multiple metadata fields
log.warning('API rate limit', { limit: 1000, current: 999 });

13. Error with custom metadata
log.error('Validation failed', { field: 'email', value: 'invalid' });

14. Nested groups in browser
log.info('Complex operation', { step: 1, details: { status: 'ok' } });

15. Testing uncaught exception
setTimeout(() => { throw new Error('Test error'); }, 1000);

16. Promise rejection
Promise.reject('Test rejection');

17. Long message
log.info('This is a very long message to test how it wraps in the console output');

18. Multiple loggers
const authLog = Logger.getLogger('Auth');
authLog.info('Login attempt');
log.info('Main process continues');

19. Custom stack depth
log.error('Deep error', { stack: log.getFullStack() });

20. Conditional logging
const verbose = true;
if (verbose) log.debug('Verbose mode enabled');

21. Timestamp override
const customTimeLog = new Logger('CustomTime', { showTimestamp: false });
customTimeLog.info('No time shown');

22. Error with full context
log.error('Complex failure', { status: 500, retry: false, error: new Error('API down') });

API Reference

Logger(name, options) - Creates a new logger instance
- name: string (default: "root")
- options: object
  - showTimestamp: boolean (default: true)
  - showCaller: boolean (default: true)
  - env: string (default: "development")
  - exitOnError: boolean (default: true)
  - suppressBrowserErrors: boolean (default: false)

Methods:
- info(message, meta) - Log an info message
- debug(message, meta) - Log a debug message (skipped in production)
- warning(message, meta) - Log a warning message
- error(message, errOrMeta) - Log an error message with stack trace
- critical(message, errOrMeta) - Log a critical message with stack trace
- static getLogger(name, options) - Get a logger instance

License

MIT