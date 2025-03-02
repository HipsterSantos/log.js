// src/logger.js
const COLORS = {
    RESET: "\x1b[0m",
    INFO: "\x1b[34m",
    DEBUG: "\x1b[36m",
    WARNING: "\x1b[33m",
    ERROR: "\x1b[31m",
    CRITICAL: "\x1b[41m\x1b[37m", // Red background, white text
};

class Logger {
    constructor(name = "root", options = {}) {
        this.name = name;
        this.options = {
            showTimestamp: options.showTimestamp ?? true,
            showCaller: options.showCaller ?? true,
            env: options.env || (typeof process !== "undefined" ? process.env.NODE_ENV : "development"),
            ...options,
        };
        this.monitorErrors();
    }

    // Enhanced stack tracing
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

    // Get full stack trace
    getFullStack() {
        return new Error().stack.split("\n").slice(2).join("\n");
    }

    log(level, message, meta = {}) {
        if (this.options.env === "production" && level === "DEBUG") return;

        const timestamp = this.options.showTimestamp ? new Date().toISOString() : "";
        const color = COLORS[level.toUpperCase()] || COLORS.INFO;
        const callerInfo = this.options.showCaller ? this.getCallerInfo() : "";
        const isBrowser = typeof window !== "undefined";
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
        if (typeof window !== "undefined") {
            window.onerror = (msg, url, line, col, error) => {
                this.error(`Browser Error: ${msg}`, error);
                return this.options.suppressBrowserErrors !== true;
            };
        }
    }

    static getLogger(name, options) {
        return new Logger(name, options);
    }
}

export default Logger;
if (typeof module !== "undefined" && module.exports) {
    module.exports = Logger;
}