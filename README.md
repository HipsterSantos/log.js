# @hipstersantos/colorful-logger

A lightweight, colorful logging utility for **Node.js** and **browser** environments, supporting both **CommonJS** and **ESM**. Ideal for debugging, monitoring, and production logging with customizable output.

[GitHub Repository](https://github.com/HipsterSantos/log.js) | [npm Package](https://www.npmjs.com/package/@hipstersantos/colorful-logger)

![npm version](https://badge.fury.io/js/@hipstersantos%2Fcolorful-logger.svg)

---

## 🚀 Features

- 🎨 **Color-Coded Logs**: Info (blue), Debug (cyan), Warning (yellow), Error (red), Critical (white on red).
- 📊 **Stack Tracing**: Includes caller information and full stack traces for better debugging.
- ⚙️ **Customizable**: Toggle timestamps, caller info, and environment-specific behavior.
- 🌐 **Universal Compatibility**: Supports **CommonJS** (`require`) and **ESM** (`import`).
- 🛡️ **Error Monitoring**: Captures uncaught exceptions and unhandled promise rejections globally.
- 🔍 **Dynamic Import**: Supports lazy loading for performance optimization.
- 📝 **Metadata Support**: Enhance logs with objects, arrays, or custom data.
- 📦 **Memory-Safe**: Prevents event listener leaks with single-instance global handlers.
- 🖥️ **Browser-Friendly**: Uses collapsible console groups for complex metadata.

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

## 📚 Usage

### CommonJS

```javascript
const Logger = require('@hipstersantos/colorful-logger');

const log = new Logger('MyApp');
log.info('Server started');
log.debug('User request', { userId: 123 });
log.error('Something went wrong', new Error('Oops'));

// Cleanup (optional, recommended for long-running apps)
log.destroy();
```

### ES Module (ESM)

```javascript
import Logger from '@hipstersantos/colorful-logger';

const log = new Logger('MyApp');
log.info('Server started');
log.debug('User request', { userId: 123 });
log.error('Something went wrong', new Error('Oops'));

// Cleanup
log.destroy();
```

### Dynamic Import (Lazy Loading)

```javascript
const logger = await Logger.dynamicImport('DynamicApp');
logger.info('Loaded dynamically');
```

---

## ⚙️ Configuration Options

Customize your logger:

```javascript
const log = new Logger('CustomApp', {
  showTimestamp: false, // Hide timestamps
  showCaller: false,    // Hide caller info
  env: 'production',    // Suppress debug logs in production
});
```

| Option              | Type     | Default       | Description                                |
|---------------------|----------|---------------|--------------------------------------------|
| `showTimestamp`     | Boolean  | `true`        | Display timestamps in log messages.        |
| `showCaller`        | Boolean  | `true`        | Display the caller function info.          |
| `env`               | String   | `development` | Environment mode (e.g., 'production').     |
| `exitOnError`       | Boolean  | `true`        | Exit process on errors (Node.js only).     |
| `suppressBrowserErrors` | Boolean  | `false`    | Suppress errors in the browser console.    |
| `dynamicImport`     | Boolean  | `false`       | Enable lazy loading (CommonJS only).       |

---

## 📊 API Reference

### Methods

| Method                    | Description                                 |
|---------------------------|---------------------------------------------|
| `info(message, meta)`     | Logs an informational message (blue).       |
| `debug(message, meta)`    | Logs a debug message (cyan).                |
| `warning(message, meta)`  | Logs a warning message (yellow).             |
| `error(message, meta)`    | Logs an error message (red) with stack trace.|
| `critical(message, meta)` | Logs a critical message (red background).    |
| `destroy()`               | Cleans up event listeners and global tracking.|
| `getLogger(name, options)`| Creates or retrieves a logger instance.       |
| `dynamicImport(name)`     | Lazily loads a logger (CommonJS only).       |

---

## 📜 Changelog

### v1.2.8 (March 07, 2025)

**Memory Leak Prevention:**

- Global error handlers (`uncaughtException`, `unhandledRejection`) are now registered only once, preventing listener accumulation.
- Introduced `destroy()` method to remove logger instances and clean up global event listeners.

**Robustness:**

- Fixed handling of `null` metadata to prevent errors when accessing `stack`.

**Compatibility:**

- Fully backward-compatible with previous versions.

### v1.2.7

- Fixed `import.meta` usage in `.cjs` files, ensuring proper CommonJS compatibility.
- Improved consistency by adding a local `package.json` in examples.

### v1.2.6

- Initial memory leak fix for `MaxListenersExceededWarning`.
- Enhanced module type detection.

---

## 🛠️ Best Practices

- **Cleanup:** Call `logger.destroy()` in long-running applications to free resources.
- **Intervals:** Clear intervals or timeouts (e.g., `clearInterval`) to prevent memory leaks.
- **Production:** Set `env: 'production'` to suppress debug logs automatically.

---

## 📊 Examples

Explore comprehensive usage examples in the [examples](https://github.com/HipsterSantos/log.js/tree/main/examples) directory:

- `usage.js` - CommonJS example.
- `usage.mjs` - ESM example.

---

## ✅ Testing

Run the test suite:

```bash
npm test
```

---

## 📜 License

Licensed under the [MIT License](LICENSE).

