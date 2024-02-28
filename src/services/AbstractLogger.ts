import { LogLevel } from "../types/LogLevel";
import ServiceMetadata from "../types/ServiceMetadata"
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import { LoggerConfig } from "@models/LoggerConfig";

export class LoggingService {
    private static instance: LoggingService;
    private loggerConfig: LoggerConfig;
    private servicesMetadata: ServiceMetadata[] = [];
    private loggerStylesConfig: LoggerStylesConfig;
    private loggerStyleService: LoggerStyleService;

    private constructor(loggerConfig: LoggerConfig, loggerStylesConfig: LoggerStylesConfig) {
        this.loggerConfig = loggerConfig;
        this.loggerStylesConfig = loggerStylesConfig;
        this.loggerStyleService = new LoggerStyleService(loggerStylesConfig, loggerConfig.loggerMode);
    }

    public static getInstance(loggerConfig: LoggerConfig, loggerStylesConfig: LoggerStylesConfig): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService(loggerConfig, loggerStylesConfig);
        }
        return LoggingService.instance;
    }

    public registerService(metadata: ServiceMetadata): void {
        // Vérifie si le service est déjà enregistré
        const isServiceRegistered = this.servicesMetadata.some(service => service.serviceName === metadata.serviceName);
        if (!isServiceRegistered) {
            this.servicesMetadata.push(metadata);
        }
    }

    // Méthode concrète pour logger le message dans la console
    private logMessage(formattedMessage: string): void {
        console.log(formattedMessage);
    }

    // Méthode pour déterminer si le message doit être loggé en fonction du niveau de log configuré
    protected shouldLog(messageLevel: LogLevel): boolean {
        return messageLevel >= this.loggerConfig.logLevel;
    }

    // Méthode utilitaire pour enregistrer un service si nécessaire
    private registerServiceIfNeeded(serviceName: string): void {
        const serviceExists = this.servicesMetadata.some(service => service.serviceName === serviceName);
        if (!serviceExists) {
            // Supposons que chaque service non enregistré est un sous-processus par défaut
            // Vous pouvez ajuster cette logique selon les besoins
            this.registerService({ serviceName, isMainProcess: false });
        }
    }

    // Méthodes publiques pour logger à chaque niveau de log
    public logTrace(processName: string, message: string): void {
        if (this.shouldLog(LogLevel.TRACE)) {
            const formattedMessage = this.loggerStyleService.formatTrace(processName, message);
            this.logMessage(formattedMessage);
        }
    }

    public logDebug(processName: string, message: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const formattedMessage = this.loggerStyleService.formatDebug(processName, message);
            this.logMessage(formattedMessage);
        }
    }

    public logInfo(processName: string, message: string): void {
        if (this.shouldLog(LogLevel.INFO)) {
            const formattedMessage = this.loggerStyleService.formatInfo(processName, message);
            this.logMessage(formattedMessage);
        }
    }

    public logWarn(processName: string, message: string): void {
        if (this.shouldLog(LogLevel.WARN)) {
            const formattedMessage = this.loggerStyleService.formatWarn(processName, message);
            this.logMessage(formattedMessage);
        }
    }

    public logError(processName: string, message: string): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            const formattedMessage = this.loggerStyleService.formatError(processName, message);
            this.logMessage(formattedMessage);
        }
    }
}
