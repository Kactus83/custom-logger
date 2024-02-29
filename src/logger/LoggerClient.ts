import { LoggerConfig } from "@models/LoggerConfig";
import { LoggerStylesConfig } from "@models/LoggerStylesConfig";
import { LoggingService } from "./LoggingService";
import { LogLevel } from "../types/LogLevel";
import ServiceMetadata from "../types/ServiceMetadata";
import { ColorChoice } from "../types/TerminalColors";

abstract class LoggerClient {
    protected static loggerConfig?: LoggerConfig;
    protected static loggerStylesConfig?: LoggerStylesConfig;

    // Définir la configuration pour LoggerClient
    public static configure(loggerConfig: LoggerConfig, loggerStylesConfig: LoggerStylesConfig): void {
        LoggerClient.loggerConfig = loggerConfig;
        LoggerClient.loggerStylesConfig = loggerStylesConfig;
    }

    protected serviceMetadata: ServiceMetadata;

    constructor(serviceName: string, isMainProcess: boolean, color?: ColorChoice) {
        this.ensureLoggingServiceInitialized();
        this.serviceMetadata = { serviceName, isMainProcess, color };

        LoggingService.getInstance().registerServiceIfNeeded(this.serviceMetadata);
    }

    protected log(level: LogLevel, message: string): void {
        LoggingService.getInstance().log(this.serviceMetadata, level, message);
    }

    private ensureLoggingServiceInitialized(): void {
        // Vérifie si LoggingService a déjà été initialisé
        if (!LoggingService.isInitialized() && LoggerClient.loggerConfig && LoggerClient.loggerStylesConfig) {
            LoggingService.initialize(LoggerClient.loggerConfig, LoggerClient.loggerStylesConfig);
        }
    }
}
