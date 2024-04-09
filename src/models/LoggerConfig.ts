import { LoggerDetailsLevel } from "../types/LoggerDetailsLevel";
import { LoggerMode } from "../types/LoggerMode";
import { LogLevel } from "../types/LogLevel";

/**
 * Logger Main Configuration class
 */
export class LoggerConfig {
    logLevel: LogLevel;
    loggerMode: LoggerMode;
    detailsLevel: LoggerDetailsLevel;
    showHierarchy: boolean;
    showTimestamp: boolean;
    tagsMaxLength: number = 20;


    constructor(logLevel: LogLevel = LogLevel.INFO, loggerMode: LoggerMode = LoggerMode.CLASSIC, detailLevel: LoggerDetailsLevel = LoggerDetailsLevel.DEFAULT, showHierarchy: boolean = false, showTimestamp: boolean = true) {
        this.logLevel = logLevel;
        this.loggerMode = loggerMode;
        this.detailsLevel = detailLevel;
        this.showHierarchy = showHierarchy;
        this.showTimestamp = showTimestamp;
    }
}
