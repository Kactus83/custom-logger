import { MainProcessMetadata } from "../../types/ServiceMetadata";
import { LoggerClient } from "./LoggerClient";
import { LoggingService } from "../LoggingService";
import { LoggerConfig } from "../../models/LoggerConfig";
import { LoggerMode } from "../../types/LoggerMode";
import { LogLevel } from "../../types/LogLevel";

export class MainProcessLoggerClient extends LoggerClient {
    private logLevel: LogLevel;
    private loggerMode: LoggerMode;

    constructor(serviceName: string, loggerMode: LoggerMode, logLevel: LogLevel) {
        super(serviceName);
        this.loggerMode = loggerMode;
        this.logLevel = logLevel;
    }

    protected init(): void {
        if (!LoggingService.isInitialized()) {
            const loggerConfig = new LoggerConfig(this.logLevel, this.loggerMode);
            LoggingService.initialize(loggerConfig);
        }
    }

    protected getServiceMetadata(): MainProcessMetadata {
        return new MainProcessMetadata(this.serviceName);
    }
}
