// src/logger.js
const COLORS = {
    RESET: "\x1b[0m",
    INFO: "\x1b[34m",
    DEBUG: "\x1b[36m",
    WARNING: "\x1b[33m",
    ERROR: "\x1b[31m",
    CRITICAL: "\x1b[41m\x1b[37m",
};

const isESM = typeof import.meta !== 'undefined' || (typeof process !== 'undefined' && process.versions && process.versions.node && require.main && require.main.filename.endsWith('.mjs'));
const isCommonJS = typeof module !== 'undefined' && module.exports && !isESM;
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

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
        const callerInfo = this.options.showCaller ? this.getCallerInfo(4) : ""; // Offset for extension
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
            const module = await import('./logger.js');
            return module.default.getLogger(name, { ...options, dynamicImport: true });
        }
        return Logger.getLogger(name, { ...options, dynamicImport: true });
    }
}

export default Logger;

if (isCommonJS) {
    module.exports = Logger;
    module.exports.dynamicImport = Logger.dynamicImport;
}

if (typeof require !== "undefined" && require.main === module) {
    (async () => {
        const logger = isESM || isBrowser ? Logger.getLogger("Test") : await Logger.dynamicImport("Test");
        logger.info("Logger initialized automatically");
    })();
}