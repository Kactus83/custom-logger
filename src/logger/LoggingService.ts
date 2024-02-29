import { LoggerConfig } from "@models/LoggerConfig";
import { LoggerStylesConfig } from "@models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import ServiceMetadata from "../types/ServiceMetadata";
import { LogLevel } from "../types/LogLevel";

class LoggingService {
    private static instance: LoggingService | null = null;
    private loggerConfig?: LoggerConfig;
    private loggerStylesConfig?: LoggerStylesConfig;
    private loggerStyleService?: LoggerStyleService;
    private servicesMetadata: ServiceMetadata[] = [];

    // Constructeur privé pour empêcher l'instanciation directe
    private constructor() {}

    // Méthode pour obtenir l'instance singleton
    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    // Initialisation du service de log avec configuration
    public init(loggerConfig: LoggerConfig, loggerStylesConfig: LoggerStylesConfig): void {
        this.loggerConfig = loggerConfig;
        this.loggerStylesConfig = loggerStylesConfig;
        this.loggerStyleService = new LoggerStyleService(loggerStylesConfig, loggerConfig.loggerMode);
    }

    // Mise à jour de la configuration du service de log
    public updateConfig(loggerConfig: LoggerConfig, loggerStylesConfig: LoggerStylesConfig): void {
        this.init(loggerConfig, loggerStylesConfig);
    }

    // Méthode pour logger les messages
    public log(metadata: ServiceMetadata, level: LogLevel, message: string): void {
        if (!this.loggerConfig || !this.loggerStyleService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before logging.");
        }

        if (this.shouldLog(level)) {
            this.registerServiceIfNeeded(metadata);
            const storedMetadata = this.findServiceMetadata(metadata.serviceName);
            if (storedMetadata) {
                const formattedMessage = this.loggerStyleService.formatMessage(storedMetadata, level, message);
                this.processConsoleLog(formattedMessage);
            }
        }
    }

    // Autres méthodes privées pour le fonctionnement interne du service de log
    private shouldLog(level: LogLevel): boolean {
        return this.loggerConfig ? level >= this.loggerConfig.logLevel : false;
    }

    private registerServiceIfNeeded(metadata: ServiceMetadata): void {
        if (!this.findServiceMetadata(metadata.serviceName)) {
            this.servicesMetadata.push(metadata);
        }
    }

    private findServiceMetadata(serviceName: string): ServiceMetadata | undefined {
        return this.servicesMetadata.find(service => service.serviceName === serviceName);
    }

    private processConsoleLog(message: string): void {
        console.log(message);
    }
}
