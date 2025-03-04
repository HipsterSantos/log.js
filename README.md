# @hipstersantos/colorful-logger

A feature-rich, colorful logging library for **Node.js** and **browser** environments, now with seamless support for **ES Modules (ESM)**, **CommonJS**, and **automatic module detection**.

[GitHub Repository](https://github.com/hipstersantos/colorful-logger) | [npm Package](https://www.npmjs.com/package/@hipstersantos/colorful-logger)

---

## 🚀 Features

- 🎨 **Color-Coded Log Levels**: Visually distinguish `INFO`, `DEBUG`, `WARNING`, `ERROR`, and `CRITICAL` logs.
- 📊 **Stack Tracing**: Get detailed caller information and full stack traces for easier debugging.
- ⚙️ **Customizable Options**: Tailor logging behavior to your specific needs.
- 🌐 **Universal Compatibility**: Works seamlessly in Node.js (ESM & CommonJS) and browser environments.
- 🛡️ **Error Monitoring**: Automatically captures uncaught exceptions and unhandled promise rejections.
- 📝 **Metadata Support**: Add rich context to logs with objects, arrays, or custom data.
- 🔍 **Module Detection**: Automatically adapts to your project’s module system (ESM or CommonJS).
- 📦 **Dynamic Import**: Supports lazy loading for performance optimization.

---

## 📥 Installation

Install via **npm**:

```bash
npm install @hipstersantos/colorful-logger
```

Or via **Yarn**:

```bash
yarn add @hipstersantos/colorful-logger
```

---

## 📚 Quick Start

### ES Module (ESM)

```javascript
import Logger from '@hipstersantos/colorful-logger';

const logger = Logger.getLogger('MyApp');
logger.info('Hello from ESM!');
```

### CommonJS

```javascript
const Logger = require('@hipstersantos/colorful-logger');

const logger = Logger.getLogger('MyApp');
logger.info('Hello from CommonJS!');
```

### Dynamic Import (Lazy Loading)

```javascript
const loggerPromise = require('@hipstersantos/colorful-logger').dynamicImport('MyApp');
loggerPromise.then(logger => logger.info('Hello with dynamic import!'));
```

### Browser

```html
<script type="module">
  import Logger from 'https://unpkg.com/@hipstersantos/colorful-logger@1.2.0/src/logger.js';
  const logger = Logger.getLogger('BrowserApp');
  logger.info('Hello from the browser!');
</script>
```

---

## ⚙️ Configuration Options

Customize your logger:

```javascript
const logger = new Logger('App', {
  showTimestamp: true,          // Display timestamps (default: true)
  showCaller: true,             // Show caller info (default: true)
  env: 'development',           // Environment mode (default: process.env.NODE_ENV)
  exitOnError: true,            // Exit on uncaught errors (Node.js only)
  suppressBrowserErrors: false, // Suppress browser error handling (default: false)
  dynamicImport: false          // Enable lazy loading (CommonJS only, default: false)
});
```

---

## 📖 Usage Examples

### Basic Logging

```javascript
logger.info('App started');
logger.debug('Initializing');
logger.warning('Low memory');
logger.error('Failed to connect');
logger.critical('System down');
```

### Metadata Support

```javascript
logger.info('User logged in', { userId: 123 });
logger.warning('API limit', { limit: 1000, current: 995 });
logger.info('Profile update', { user: { id: 1, name: 'Alice' } });
logger.debug('Batch done', { items: [1, 2, 3] });
```

### Error Handling

```javascript
logger.error('DB error', new Error('Timeout'));
logger.error('Manual trace', { stack: logger.getFullStack() });

setTimeout(() => { throw new Error('Crash'); }, 1000);

Promise.reject('Failed promise');
```

### Customization

```javascript
const noTime = new Logger('NoTime', { showTimestamp: false });
noTime.info('Quick log');

const prod = new Logger('Prod', { env: 'production' });
prod.debug('Hidden');
prod.info('Visible');
```

### Multiple Loggers

```javascript
const auth = Logger.getLogger('Auth');
const payment = Logger.getLogger('Payment');

auth.info('User login');
payment.info('Transaction started');
```

---

## 📊 API Reference

### `Logger(name, options)`

| Parameter  | Type    | Default          | Description                         |
|------------|---------|------------------|-------------------------------------|
| `name`     | String  | "root"           | Logger identifier.                  |
| `options`  | Object  | `{}`             | Logger configuration options.       |

### Options

| Option              | Type     | Default          | Description                                |
|---------------------|----------|------------------|--------------------------------------------|
| `showTimestamp`     | Boolean  | `true`           | Display timestamps in log messages.        |
| `showCaller`        | Boolean  | `true`           | Display the caller function info.          |
| `env`               | String   | `development`    | Environment mode (e.g., development, production). |
| `exitOnError`       | Boolean  | `true`           | Exit process on errors (Node.js only).     |
| `suppressBrowserErrors` | Boolean  | `false`      | Suppress errors in the browser console.    |
| `dynamicImport`     | Boolean  | `false`          | Enable lazy loading (CommonJS only).       |

### Methods

| Method                    | Description                                 |
|---------------------------|---------------------------------------------|
| `info(message, meta)`     | Logs an informational message (blue).       |
| `debug(message, meta)`    | Logs a debug message (cyan).                |
| `warning(message, meta)`  | Logs a warning message (yellow).             |
| `error(message, meta)`    | Logs an error message (red) with stack trace.|
| `critical(message, meta)` | Logs a critical message (red background).    |
| `getLogger(name, options)`| Creates a new logger instance.               |
| `dynamicImport(name)`     | Lazily loads a logger (CommonJS only).       |

---

## 📌 Integration & Use Cases

- **Error Tracking**: Capture and log unhandled errors and rejections.
- **Microservices**: Use named loggers for different services.
- **Frontend Debugging**: Track user actions and browser events.
- **Backend Monitoring**: Log API calls, database queries, and file operations.
- **Testing**: Enhance test output with colorful, structured logs.

---

## ✅ Testing

Run the test suite:

```bash
npm test
```

---

## 📜 License

Released under the [MIT License](LICENSE).

---

## 🤝 Contributing

Fork the repository, create a feature branch, and submit a pull request.

---

## 📧 Contact

Author: [hipstersantos](mailto:santoscampos269@gmail.com)

---

## 📆 Changelog

### 1.2.0 (March 2025)

- Added ESM and CommonJS support.
- Introduced automatic module detection.
- Implemented `dynamicImport` for lazy loading.
- Expanded examples to 50+ scenarios.

