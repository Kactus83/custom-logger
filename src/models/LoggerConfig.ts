import { LoggerMode } from "../types/LoggerMode";
import { LogLevel } from "../types/LogLevel";

export class LoggerConfig {
    logLevel: LogLevel;
    loggerMode: LoggerMode;
    showHierarchy: boolean;
    showTimestamp: boolean;


    constructor(logLevel: LogLevel = LogLevel.INFO, loggerMode: LoggerMode = LoggerMode.CLASSIC, showHierarchy: boolean = false, showTimestamp: boolean = true) {
        this.logLevel = logLevel;
        this.loggerMode = loggerMode;
        this.showHierarchy = showHierarchy;
        this.showTimestamp = showTimestamp;
    }
}
