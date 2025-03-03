# @hipstersantos/colorful-logger

A feature-rich, colorful logging library for Node.js and browser environments.

https://github.com/HipsterSantos/log.js

## 🌟 Features

- 🌈 **Color-coded log levels** for easy visual identification.
- 📊 **Stack tracing** for in-depth error inspection.
- 🔧 **Customizable options** to suit your logging needs.
- 🌐 **Cross-environment support** (Node.js and browser).
- 🛠️ **Error monitoring** with uncaught exceptions and promise rejection handling.
- 📦 **Metadata support** to add extra context to logs.

## 📥 Installation

```bash
npm install @hipstersantos/colorful-logger
```

## 🚀 Quick Start

### ES Module
```javascript
import Logger from '@hipstersantos/colorful-logger';

const logger = Logger.getLogger('MyApp');
logger.info('Hello, world!');
```

### CommonJS
```javascript
const Logger = require('@hipstersantos/colorful-logger');

const logger = Logger.getLogger('MyApp');
logger.info('Hello, world!');
```

## 🔧 Configuration Options

```javascript
const logger = new Logger('App', {
    showTimestamp: true,         // Display timestamp (default: true)
    showCaller: true,            // Display caller information (default: true)
    env: 'development',          // Environment ("development" or "production")
    exitOnError: true,           // Exit process on uncaught exceptions (default: true)
    suppressBrowserErrors: false // Suppress browser errors (default: false)
});
```

## 📊 Usage Examples

### 1. Basic Logging
```javascript
logger.info('Application started');
```

### 2. Debugging with Metadata
```javascript
logger.debug('User fetched', { userId: 42 });
```

### 3. Warnings
```javascript
logger.warning('Disk space low', { freeSpace: '500MB' });
```

### 4. Error Logging with Stack Trace
```javascript
const error = new Error('Connection failed');
logger.error('Database error', error);
```

### 5. Critical Errors
```javascript
logger.critical('System crash detected', { reason: 'Out of Memory' });
```

### 6. Custom Logger Instances
```javascript
const dbLogger = Logger.getLogger('Database');
dbLogger.info('Query executed');
```

### 7. Handling Uncaught Exceptions
```javascript
setTimeout(() => { throw new Error('Unexpected error'); }, 1000);
```

### 8. Handling Promise Rejections
```javascript
Promise.reject(new Error('Promise failed'));
```

### 9. Browser-Specific Logging
```javascript
if (typeof window !== 'undefined') {
    logger.info('Running in browser');
}
```

### 10. Production Mode (Suppress Debug)
```javascript
const prodLogger = new Logger('ProdApp', { env: 'production' });
prodLogger.debug('This will not log');
```

### 11. Conditional Logging
```javascript
const isVerbose = true;
if (isVerbose) logger.debug('Verbose logging enabled');
```

## 📚 API Reference

### `Logger(name, options)`

| Parameter      | Type    | Default       | Description                          |
|----------------|---------|---------------|--------------------------------------|
| `name`         | string  | "root"        | Logger name (for grouping logs).     |
| `options`      | object  | `{}`          | Configuration options.               |

**Options:**

| Option                 | Type     | Default        | Description                                      |
|------------------------|----------|----------------|--------------------------------------------------|
| `showTimestamp`        | boolean  | `true`         | Show timestamp in logs.                          |
| `showCaller`           | boolean  | `true`         | Include caller information in logs.              |
| `env`                  | string   | `"development"`| Environment mode ("development" or "production").|
| `exitOnError`          | boolean  | `true`         | Exit process on errors (Node.js only).           |
| `suppressBrowserErrors`| boolean  | `false`        | Suppress browser errors.                         |

### Logger Methods

| Method                    | Description                                      |
|---------------------------|--------------------------------------------------|
| `info(message, meta)`     | Logs an informational message.                   |
| `debug(message, meta)`    | Logs a debug message (hidden in production).     |
| `warning(message, meta)`  | Logs a warning message.                           |
| `error(message, meta)`    | Logs an error message with a stack trace.         |
| `critical(message, meta)` | Logs a critical message with an extended stack trace.|
| `getLogger(name, options)`| Returns a new logger instance.                    |

## 📊 Integration & Use Cases

1. **Error Reporting:** Automatically captures and logs uncaught exceptions and promise rejections.
2. **Microservices:** Use unique logger instances for each service.
3. **Performance Monitoring:** Monitor system resources and app health.
4. **Browser Debugging:** Capture and log client-side errors.

## 🧪 Testing

Ensure all functionality works as expected:

```bash
npm test
```


## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 📣 Contributing

We welcome contributions! Feel free to open issues and submit pull requests.

## 📬 Contact

Author: [hipstersantos](mailto:santoscampos269@gmail.com)

Stay tuned for upcoming features and updates!