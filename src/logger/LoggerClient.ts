import { LoggerConfig } from "../models/LoggerConfig";
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggingService } from "./LoggingService";
import { LogLevel } from "../types/LogLevel";
import ServiceMetadata from "../types/ServiceMetadata";
import { ColorChoice } from "../types/TerminalColors";
import { LoggerMode } from "../types/LoggerMode";

// Configuration par défaut pour LoggerStylesConfig
const defaultLoggerStylesConfig = new LoggerStylesConfig();

export abstract class LoggerClient {
    protected serviceMetadata: ServiceMetadata;

    constructor(serviceName: string, isMainProcess: boolean = false, logLevel: LogLevel = LogLevel.INFO, color?: ColorChoice) {
        // Crée une configuration de logger spécifique à ce client
        const loggerConfig = new LoggerConfig(logLevel, LoggerMode.CLASSIC);
        
        // Initialise LoggingService avec la configuration spécifique si nécessaire
        this.ensureLoggingServiceInitialized(loggerConfig);

        // Configuration spécifique du service client
        this.serviceMetadata = { serviceName, isMainProcess, color };
        
        // Enregistrement du service
        LoggingService.getInstance().registerServiceIfNeeded(this.serviceMetadata);
    }

    protected log(level: LogLevel, message: string): void {
        LoggingService.getInstance().log(this.serviceMetadata, level, message);
    }

    private ensureLoggingServiceInitialized(loggerConfig: LoggerConfig): void {
        if (!LoggingService.isInitialized()) {
            // Initialise le service de log avec la configuration spécifique au client et la configuration par défaut des styles
            LoggingService.initialize(loggerConfig, defaultLoggerStylesConfig);
        } else {
            // Optionnel : Mettre à jour la configuration si nécessaire
            // LoggingService.getInstance().updateConfig(loggerConfig, defaultLoggerStylesConfig);
        }
    }
}
