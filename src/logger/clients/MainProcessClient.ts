import { LoggerClient } from "./LoggerClient";
import { LoggerConfig } from "../../models/LoggerConfig";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";
import { MainProcessMetadata } from "../../types/ServiceMetadata";
import { LoggerMode } from "../../types/LoggerMode";
import { MainProcessLoggerConfig } from "../../models/MainProcessLoggerClientConfig";
import { LoggerDetailsLevel } from "../../types/LoggerDetailsLevel";

/**
 * Extends LoggerClient to provide logging functionality specifically for main processes.
 */
export class MainProcessLoggerClient extends LoggerClient {
    
    /**
     * Constructs a MainProcessLoggerClient with configuration.
     * @param {MainProcessLoggerConfig} config - The configuration for the main process logger.
     */
    constructor(config: MainProcessLoggerConfig) {
        super(config.serviceName);
        this.initLogger(config.loggerMode, config.logLevel, config.detailsLevel, config.showHierarchy, config.showTimestamp);
    }

    /**
     * Initializes the logger with specific settings for the main process.
     * @private
     */
    private initLogger(loggerMode: LoggerMode, logLevel: LogLevel, detailsLevel: LoggerDetailsLevel, showHierarchy: boolean, showTimestamp: boolean): void {
        if (!LoggingService.isInitialized()) {
            const loggerConfig = new LoggerConfig(logLevel, loggerMode, detailsLevel, showHierarchy, showTimestamp);
            LoggingService.initialize(loggerConfig);
        }
        this.processId = this.register();
    }

    /**
     * Registers the main process and retrieves its process ID.
     * @protected
     * @returns {string} The process ID.
     */
    protected register(): string {
        const metadata = new MainProcessMetadata(this.serviceName);
        return LoggingService.getInstance().registerService(metadata);
    }
}