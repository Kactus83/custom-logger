import { LoggerClient } from "./LoggerClient";
import { LoggerConfig } from "../../models/LoggerConfig";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";
import { MainProcessMetadata } from "../../types/ServiceMetadata";
import { LoggerMode } from "../../types/LoggerMode";
import { MainProcessLoggerConfig } from "@models/MainProcessLoggerClientConfig";

export class MainProcessLoggerClient extends LoggerClient {
    constructor(config: MainProcessLoggerConfig) {
        super(config.serviceName);
        this.initLogger(config.loggerMode, config.logLevel, config.showHierarchy, config.showTimestamp);
    }

    private initLogger(loggerMode: LoggerMode, logLevel: LogLevel, showHierarchy: boolean, showTimestamp: boolean): void {
        if (!LoggingService.isInitialized()) {
            const loggerConfig = new LoggerConfig(logLevel, loggerMode, showHierarchy, showTimestamp);
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