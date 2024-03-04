import { LoggerClient } from "./LoggerClient";
import { LoggerConfig } from "../../models/LoggerConfig";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";
import { MainProcessMetadata } from "../../types/ServiceMetadata";
import { LoggerMode } from "../../types/LoggerMode";

export class MainProcessLoggerClient extends LoggerClient {
    constructor(serviceName: string, loggerMode: LoggerMode, logLevel: LogLevel) {
        super(serviceName);
        this.initLogger(loggerMode, logLevel);
    }

    private initLogger(loggerMode: LoggerMode, logLevel: LogLevel): void {
        if (!LoggingService.isInitialized()) {
            const loggerConfig = new LoggerConfig(logLevel, loggerMode);
            LoggingService.initialize(loggerConfig);
        }
        this.processId = this.register();
    }

    protected register(): string {
        const metadata = new MainProcessMetadata(this.serviceName);
        // Enregistrement et récupération de l'ID attribué au processus principal
        return LoggingService.getInstance().registerService(metadata);
    }
}