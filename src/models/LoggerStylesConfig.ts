import { LogLevel } from "../types/LogLevel";
import { ColorChoice } from "../types/TerminalColors";
import { TerminalStyles } from "../types/TerminalStyles";
import { DarkColorMapping } from "./ColorsMaps";

/**
 * Configuration for the Logger Styles
 */
export interface LoggerElementStyles {
    default: TerminalStyles[]; // Default styles for the logger element
    trace?: TerminalStyles[]; // Styles for the 'trace' log level
    debug?: TerminalStyles[]; // Styles for the 'debug' log level
    info?: TerminalStyles[]; // Styles for the 'info' log level
    warn?: TerminalStyles[]; // Styles for the 'warn' log level
    error?: TerminalStyles[]; // Styles for the 'error' log level
}

/**
 * Configuration for the Logger Element
 */
export class LoggerElementConfig {
    MainProcess: LoggerElementStyles; // Styles for the main process logger element
    SubProcess: LoggerElementStyles; // Styles for the sub process logger element

    /**
     * Creates a new instance of LoggerElementConfig.
     * @param mainProcess - Styles for the main process logger element.
     * @param subProcess - Styles for the sub process logger element.
     */
    constructor(mainProcess: LoggerElementStyles, subProcess: LoggerElementStyles) {
        this.MainProcess = mainProcess;
        this.SubProcess = subProcess;
    }

    /**
     * Gets the styles for the logger element based on the process type and log level.
     * @param isMainProcess - Indicates whether the logger element belongs to the main process.
     * @param level - The log level.
     * @returns The styles for the logger element.
     */
    getStyles(isMainProcess: boolean, level: LogLevel): TerminalStyles[] {
        const processStyles = isMainProcess ? this.MainProcess : this.SubProcess;
        return this.resolveStyles(processStyles, level);
    }

    /**
     * Resolves the styles for the logger element based on the log level.
     * @param styles - The styles for the logger element.
     * @param level - The log level.
     * @returns The resolved styles for the logger element.
     */
    private resolveStyles(styles: LoggerElementStyles, level: LogLevel): TerminalStyles[] {
        switch (level) {
            case LogLevel.TRACE: return styles.trace || styles.default;
            case LogLevel.DEBUG: return styles.debug || styles.default;
            case LogLevel.INFO: return styles.info || styles.default;
            case LogLevel.WARN: return styles.warn || styles.default;
            case LogLevel.ERROR: return styles.error || styles.default;
            default: return styles.default;
        }
    }
}

/**
 * Configuration for the Logger Styles
 */
export class LoggerStylesConfig {
    timestamp: LoggerElementConfig; // Configuration for the timestamp logger element
    logLevel: LoggerElementConfig; // Configuration for the log level logger element
    serviceName: LoggerElementConfig; // Configuration for the service name logger element
    message: LoggerElementConfig; // Configuration for the message logger element
    mainProcessColor: ColorChoice = ColorChoice.White; // Color choice for the main process
    subProcessColor: ColorChoice = ColorChoice.White; // Color choice for the sub process
    colorMapping: { [key in ColorChoice]: string } = DarkColorMapping; // Color mapping for terminal colors

    /**
     * Creates a new instance of LoggerStylesConfig.
     */
    constructor() {
        // Initialize with default styles for each logger element
        let defaultElementStyles: LoggerElementStyles = { default: [TerminalStyles.Reset] };
        this.timestamp = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.logLevel = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.serviceName = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.message = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
    }

    /**
     * Updates the current configuration with a new configuration.
     * @param newConfig - The new configuration options.
     */
    updateConfig(newConfig: LoggerStylesConfigOptions): void {
        if (newConfig.timestamp) {
            this.timestamp = new LoggerElementConfig(newConfig.timestamp.MainProcess, newConfig.timestamp.SubProcess);
        }
        if (newConfig.logLevel) {
            this.logLevel = new LoggerElementConfig(newConfig.logLevel.MainProcess, newConfig.logLevel.SubProcess);
        }
        if (newConfig.serviceName) {
            this.serviceName = new LoggerElementConfig(newConfig.serviceName.MainProcess, newConfig.serviceName.SubProcess);
        }
        if (newConfig.message) {
            this.message = new LoggerElementConfig(newConfig.message.MainProcess, newConfig.message.SubProcess);
        }
        if (newConfig.mainProcessColor) {
            this.mainProcessColor = newConfig.mainProcessColor;
        }
        if (newConfig.subProcessColor) {
            this.subProcessColor = newConfig.subProcessColor;
        }
        if (newConfig.colorMapping) {
            this.colorMapping = newConfig.colorMapping; 
        }
    }
}

/**
 * Configuration options for LoggerStylesConfig.
 */
export interface LoggerStylesConfigOptions {
    timestamp?: LoggerElementConfig; // Configuration for the timestamp logger element
    logLevel?: LoggerElementConfig; // Configuration for the log level logger element
    serviceName?: LoggerElementConfig; // Configuration for the service name logger element
    message?: LoggerElementConfig; // Configuration for the message logger element
    mainProcessColor?: ColorChoice; // Color choice for the main process
    subProcessColor?: ColorChoice; // Color choice for the sub process
    colorMapping?: { [key in ColorChoice]: string }; // Color mapping for terminal colors
}
