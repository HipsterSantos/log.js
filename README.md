# @hipstersantos/colorful-logger

A feature-rich, colorful logging library for **Node.js** and **browser** environments, now with seamless support for **ES Modules (ESM)**, **CommonJS**, and **automatic module detection**.

[GitHub Repository](https://github.com/HipsterSantos/log.js) | [npm Package](https://www.npmjs.com/package/@hipstersantos/colorful-logger)

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
- 🖥️ **VSCode Integration**: Displays log output directly in hover tooltips within VSCode.

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
  showTimestamp: true,
  showCaller: true,
  env: 'development',
  exitOnError: true,
  suppressBrowserErrors: false,
  dynamicImport: false
});
```

---

## 🖥️ VSCode Extension Integration

### 📌 How It Works

The **@hipstersantos/colorful-logger VSCode Extension** enhances the logging experience by providing **hover tooltips** for log statements directly inside the VSCode editor.

- 🟢 **Hover Over Log Statements**: See simulated log output as a tooltip without running the code.
- 🔍 **Highlighted Log Levels**: Log levels (`INFO`, `DEBUG`, `WARNING`, `ERROR`, `CRITICAL`) are emphasized for better readability.
- 🚨 **Error Diagnostics & Fixes**: `logger.error()` statements include suggested fixes and stack traces in the tooltip.

### 🔧 Installation

1. Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/hipstersantos/colorful-logger).
2. Enable the extension in your workspace settings.
3. Hover over `logger.info()`, `logger.debug()`, etc., to see tooltips in action.

### ⚡ Example Usage in VSCode

```javascript
const logger = Logger.getLogger('App');
logger.info('App started');
logger.error('Failed to connect', new Error('Timeout'));
```

✅ Hovering over `logger.info('App started')` will display:

```
[INFO] 2025-03-04 10:30:15 - App started
```

🚨 Hovering over `logger.error('Failed to connect')` will show:

```
[ERROR] 2025-03-04 10:30:20 - Failed to connect
⚠️ Suggested Fix: Check network connection.
🔗 Stack Trace: main.js:25
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
| `env`               | String   | `development`    | Environment mode.                          |
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

### 1.3.0 (March 2025)

- 🎉 Added VSCode extension integration with hover tooltips.
- 🛠 Improved error diagnostics and fix suggestions.
- 🚀 Enhanced color-coded logs for better readability.
- 🔥 Performance optimizations for ESM and CommonJS.
## Changes and Improvements

-Safe ESM Detection:
  Removed typeof import.meta !== 'undefined' from isESM check, as it’s invalid in CommonJS.

- Replaced with a fallback: isESM = !isCommonJS && !isBrowser || (process.argv && process.argv[1].endsWith('.mjs')).

This ensures no ReferenceError in Node.js CommonJS environments while still detecting ESM via .mjs or browser contexts.

-Robust Module Detection:
  isCommonJS: Checks module and module.exports, reliable in Node.js CommonJS.

- isBrowser: Unchanged, safe for all environments.

- isESM: Now infers ESM by exclusion or .mjs file extension, avoiding ESM-specific syntax.

- Dynamic Import Handling:
  Wrapped import('./logger.js') in a .then().catch() block to handle potential import failures gracefully in CommonJS.

- Logs errors if dynamic import fails, preventing silent failures.

- No Runtime Errors:
  All checks use typeof or property existence, which are safe in any JS environment.

- Removed reliance on require.main.filename, which could be undefined in some Node.js contexts,   replacing it with process.argv[1] for .mjs detection.


