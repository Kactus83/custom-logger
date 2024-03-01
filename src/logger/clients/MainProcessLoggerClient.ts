import { LoggerConfig } from "../../models/LoggerConfig";
import { LoggerClient } from "./LoggerClient";
import { LoggerMode } from "../../types/LoggerMode";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";

export class MainProcessLoggerClient extends LoggerClient {
    constructor(serviceName: string, loggerMode: LoggerMode, logLevel: LogLevel) {
        super(serviceName, true);
        const loggerConfig = new LoggerConfig(logLevel, loggerMode);
        LoggingService.initialize(loggerConfig);
    }
}
