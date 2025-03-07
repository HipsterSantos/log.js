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
let isCommonJS = false;
let isBrowser = false;
let isESM = false;
let nodeEnv = "development"; // Default environment

try {
    isCommonJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined';
} catch (e) {}

try {
    isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
} catch (e) {}

try {
    isESM = !isCommonJS && !isBrowser || (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('.mjs'));
    if (typeof process !== 'undefined' && process.env) {
        nodeEnv = process.env.NODE_ENV;
    }
} catch (e) {}

class Logger {
    constructor(name = "root", options = {}) {
        this.name = name;
        this.options = {
            showTimestamp: options.showTimestamp ?? true,
            showCaller: options.showCaller ?? true,
            env: options.env || nodeEnv,
            dynamicImport: options.dynamicImport ?? false,
            ...options,
        };
        this.monitorErrors();
    }

    getCallerInfo(stackOffset = 3) {
        try {
            const stack = new Error().stack.split("\n");
            const callerLine = stack[stackOffset] || "unknown";
            const match = callerLine.match(/\((.*):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.*)$/);
            if (match) {
                const [_, location] = match;
                return location.trim();
            }
            return "unknown";
        } catch (e) {
            return "unknown";
        }
    }

    getFullStack() {
        try {
            return new Error().stack.split("\n").slice(2).join("\n");
        } catch (e) {
            return "unknown";
        }
    }

    // Simulate log output for VSCode extension
    simulateLog(level, message, meta = {}) {
        try {
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
        } catch (e) {
            return `Error simulating log: ${e.message}`;
        }
    }

    log(level, message, meta = {}) {
        try {
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
        } catch (e) {
            console.error(`Error logging: ${e.message}`);
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
        try {
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
        } catch (e) {
            console.error(`Error monitoring errors: ${e.message}`);
        }
    }

    static getLogger(name, options) {
        return new Logger(name, options);
    }

    static async dynamicImport(name = "root", options = {}) {
        try {
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
        } catch (e) {
            console.error(`Error in dynamic import: ${e.message}`);
            throw e;
        }
    }
}

// ESM Export
export default Logger;

// CommonJS Export
if (isCommonJS) {
    try {
        module.exports = Logger;
        module.exports.dynamicImport = Logger.dynamicImport;
    } catch (e) {
        console.error(`Error exporting module: ${e.message}`);
    }
}

// Auto-detection and usage example
if (typeof require !== "undefined" && require.main === module) {
    (async () => {
        try {
            const logger = isESM || isBrowser ? Logger.getLogger("Test") : await Logger.dynamicImport("Test");
            logger.info("Logger initialized automatically");
            logger.debug("Debugging mode", { moduleType: isESM ? "ESM" : isCommonJS ? "CommonJS" : "Browser" });
        } catch (e) {
            console.error(`Error initializing logger: ${e.message}`);
        }
    })();
}

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
const isCommonJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof require !== 'undefined';
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isESM = !isCommonJS && !isBrowser || (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('.mjs'));
