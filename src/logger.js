// src/logger.js
const COLORS = {
    RESET: "\x1b[0m",
    INFO: "\x1b[34m",
    DEBUG: "\x1b[36m",
    WARNING: "\x1b[33m",
    ERROR: "\x1b[31m",
    CRITICAL: "\x1b[41m\x1b[37m",
};

// Safe module type detection
const isCommonJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined';
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
// ESM detection: Check if we're not CommonJS and not in a browser (Node.js ESM or browser ESM)
const isESM = !isCommonJS && !isBrowser || (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('.mjs'));

class Logger {
    constructor(name = "root", options = {}) {
        this.name = name;
        this.options = {
            showTimestamp: options.showTimestamp ?? true,
            showCaller: options.showCaller ?? true,
            env: options.env || (typeof process !== "undefined" ? process.env.NODE_ENV : "development"),
            dynamicImport: options.dynamicImport ?? false,
            ...options,
        };
        this.monitorErrors();
    }

    getCallerInfo(stackOffset = 3) {
        const stack = new Error().stack.split("\n");
        const callerLine = stack[stackOffset] || "unknown";
        const match = callerLine.match(/\((.*):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.*)$/);
        if (match) {
            const [_, location] = match;
            return location.trim();
        }
        return "unknown";
    }

    getFullStack() {
        return new Error().stack.split("\n").slice(2).join("\n");
    }

    // Simulate log output for VSCode extension
    simulateLog(level, message, meta = {}) {
        if (this.options.env === "production" && level === "DEBUG") return "Debug suppressed in production";

        const timestamp = this.options.showTimestamp ? new Date().toISOString() : "";
        const color = COLORS[level.toUpperCase()] || COLORS.INFO;
        const callerInfo = this.options.showCaller ? this.getCallerInfo(4) : "";
        const prefix = isBrowser
            ? `[${this.name}] [${level.toUpperCase()}]`
            : `${color}[${timestamp}] [${this.name}] [${level.toUpperCase()}]${this.options.showCaller ? ` [${callerInfo}]` : ""}${COLORS.RESET}`;

        let output = `${prefix} ${message}`;
        if (meta.stack) output += `\n${color}${meta.stack}${COLORS.RESET}`;
        if (Object.keys(meta).length) output += `\n${color}Meta: ${JSON.stringify(meta, null, 2)}${COLORS.RESET}`;
        return output;
    }

    log(level, message, meta = {}) {
        if (this.options.env === "production" && level === "DEBUG") return;

        const timestamp = this.options.showTimestamp ? new Date().toISOString() : "";
        const color = COLORS[level.toUpperCase()] || COLORS.INFO;
        const callerInfo = this.options.showCaller ? this.getCallerInfo() : "";
        const prefix = isBrowser
            ? `[${this.name}] [${level.toUpperCase()}]`
            : `${color}[${timestamp}] [${this.name}] [${level.toUpperCase()}]${this.options.showCaller ? ` [${callerInfo}]` : ""}${COLORS.RESET}`;

        if (isBrowser) {
            console.groupCollapsed(prefix);
            console.log(message);
            if (meta.stack) console.log(meta.stack);
            if (Object.keys(meta).length) console.log("Meta:", meta);
            console.groupEnd();
        } else {
            console.log(`${prefix} ${message}`);
            if (meta.stack) console.log(`${color}${meta.stack}${COLORS.RESET}`);
            if (Object.keys(meta).length) console.log(`${color}Meta: ${JSON.stringify(meta, null, 2)}${COLORS.RESET}`);
        }
    }

    info(message, meta = {}) {
        this.log("INFO", message, meta);
    }

    debug(message, meta = {}) {
        this.log("DEBUG", message, meta);
    }

    warning(message, meta = {}) {
        this.log("WARNING", message, meta);
    }

    error(message, errOrMeta = {}) {
        const meta = errOrMeta instanceof Error ? { stack: errOrMeta.stack } : errOrMeta;
        this.log("ERROR", message, { ...meta, stack: meta.stack || this.getFullStack() });
    }

    critical(message, errOrMeta = {}) {
        const meta = errOrMeta instanceof Error ? { stack: errOrMeta.stack } : errOrMeta;
        this.log("CRITICAL", message, { ...meta, stack: meta.stack || this.getFullStack() });
    }

    monitorErrors() {
        if (typeof process !== "undefined" && process.on) {
            process.on("uncaughtException", (err) => {
                this.error(`Uncaught Exception: ${err.message}`, err);
                if (this.options.exitOnError !== false) process.exit(1);
            });
            process.on("unhandledRejection", (reason, promise) => {
                this.warning(`Unhandled Promise Rejection: ${reason}`, { promise });
            });
        }
        if (isBrowser) {
            window.onerror = (msg, url, line, col, error) => {
                this.error(`Browser Error: ${msg}`, error);
                return this.options.suppressBrowserErrors !== true;
            };
        }
    }

    static getLogger(name, options) {
        return new Logger(name, options);
    }

    static async dynamicImport(name = "root", options = {}) {
        if (isCommonJS) {
            // Use dynamic import safely within CommonJS
            return import('./logger.js').then(module => {
                return module.default.getLogger(name, { ...options, dynamicImport: true });
            }).catch(err => {
                console.error('Dynamic import failed:', err);
                throw err;
            });
        }
        return Logger.getLogger(name, { ...options, dynamicImport: true });
    }
}

// ESM Export
export default Logger;

// CommonJS Export
if (isCommonJS) {
    module.exports = Logger;
    module.exports.dynamicImport = Logger.dynamicImport;
}

// Auto-detection and usage example
if (typeof require !== "undefined" && require.main === module) {
    (async () => {
        const logger = isESM || isBrowser ? Logger.getLogger("Test") : await Logger.dynamicImport("Test");
        logger.info("Logger initialized automatically");
        logger.debug("Debugging mode", { moduleType: isESM ? "ESM" : isCommonJS ? "CommonJS" : "Browser" });
    })();
}