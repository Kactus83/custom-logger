import { LoggerMode } from "../types/LoggerMode";
import { LogLevel } from "../types/LogLevel";

export class LoggerConfig {
    logLevel: LogLevel;
    loggerMode: LoggerMode;

    constructor(logLevel: LogLevel = LogLevel.INFO, loggerMode: LoggerMode = LoggerMode.CLASSIC) {
        this.logLevel = logLevel;
        this.loggerMode = loggerMode;
    }
}
