// src/logger.cjs
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

try {
    isCommonJS = typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof require !== 'undefined';
} catch (e) {
    isCommonJS = false;
}

try {
    isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
} catch (e) {
    isBrowser = false;
}

isESM = !isCommonJS && !isBrowser;

// Global error handlers (registered once)
let errorHandlersInitialized = false;
const globalLoggerInstances = new Set(); // Track instances for cleanup

function initializeGlobalErrorHandlers() {
    if (errorHandlersInitialized || isBrowser) return;

    try {
        if (typeof process !== "undefined" && process.on) {
            process.on("uncaughtException", (err) => {
                globalLoggerInstances.forEach(logger => {
                    logger.error(`Uncaught Exception: ${err.message}`, err);
                });
                if (globalLoggerInstances.size > 0 && ![...globalLoggerInstances][0].options.exitOnError === false) {
                    process.exit(1);
                }
            });
            process.on("unhandledRejection", (reason, promise) => {
                globalLoggerInstances.forEach(logger => {
                    logger.warning(`Unhandled Promise Rejection: ${reason}`, { promise });
                });
            });
            errorHandlersInitialized = true;
        }
    } catch (e) {
        console.warn('Failed to set up global Node.js error monitoring:', e.message);
    }
}

class Logger {
    constructor(name = "root", options = {}) {
        this.name = name;
        try {
            this.options = {
                showTimestamp: options.showTimestamp ?? true,
                showCaller: options.showCaller ?? true,
                env: options.env || (typeof process !== "undefined" ? process.env.NODE_ENV : "development"),
                dynamicImport: options.dynamicImport ?? false,
                ...options,
            };
        } catch (e) {
            console.warn('Failed to initialize options:', e.message);
            this.options = {
                showTimestamp: true,
                showCaller: true,
                env: "development",
                dynamicImport: false,
            };
        }
        globalLoggerInstances.add(this);
        initializeGlobalErrorHandlers(); // Ensure handlers are set up
    }

    getCallerInfo(stackOffset = 3) {
        try {
            const stack = new Error().stack ? new Error().stack.split("\n") : ["unknown"];
            const callerLine = stack[stackOffset] || "unknown";
            const match = callerLine.match(/\((.*):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.*)$/);
            if (match) {
                const [_, location] = match;
                return location.trim();
            }
            return "unknown";
        } catch (e) {
            return "unknown (error retrieving caller)";
        }
    }

    getFullStack() {
        try {
            return new Error().stack ? new Error().stack.split("\n").slice(2).join("\n") : "Stack unavailable";
        } catch (e) {
            return "Stack unavailable (error retrieving stack)";
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
                console.log(message || '');
                if (meta && typeof meta === 'object' && meta.stack) console.log(meta.stack);
                if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) console.log("Meta:", meta);
                console.groupEnd();
            } else {
                console.log(`${prefix} ${message || ''}`);
                if (meta && typeof meta === 'object' && meta.stack) console.log(`${color}${meta.stack}${COLORS.RESET}`);
                if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) console.log(`${color}Meta: ${JSON.stringify(meta, null, 2)}${COLORS.RESET}`);
            }
        } catch (e) {
            console.warn(`Failed to log [${level}]:`, e.message);
            console.log(`[${level.toUpperCase()}] ${message || ''} (logging failed)`);
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

    destroy() {
        globalLoggerInstances.delete(this);
        if (globalLoggerInstances.size === 0 && errorHandlersInitialized) {
            try {
                if (typeof process !== "undefined" && process.removeAllListeners) {
                    process.removeAllListeners("uncaughtException");
                    process.removeAllListeners("unhandledRejection");
                    errorHandlersInitialized = false;
                }
            } catch (e) {
                console.warn('Failed to clean up error handlers:', e.message);
            }
        }
    }

    static getLogger(name, options) {
        return new Logger(name, options);
    }

    static dynamicImport(name = "root", options = {}) {
        try {
            return Promise.resolve(Logger.getLogger(name, { ...options, dynamicImport: true }));
        } catch (e) {
            console.warn('Dynamic import failed:', e.message);
            return Promise.resolve(new Logger(name, { ...options, dynamicImport: true }));
        }
    }
}

module.exports = Logger;

try {
    if (typeof require !== "undefined" && require.main === module) {
        (async () => {
            const logger = await Logger.dynamicImport("Test");
            logger.info("Logger initialized automatically");
            logger.debug("Debugging mode", { moduleType: isESM ? "ESM" : isCommonJS ? "CommonJS" : "Browser" });
            logger.destroy(); // Cleanup example
        })();
    }
} catch (e) {
    console.warn('Auto-detection execution failed:', e.message);
}