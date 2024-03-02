import { LoggerConfig } from "../models/LoggerConfig";
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import { LogLevel } from "../types/LogLevel";
import { StyleConfigManager } from "./services/styles/StyleConfigManager";
import { RegistrationService } from "./services/registration/RegistrationService";
import { IServiceMetadata } from "../types/ServiceMetadata";

export class LoggingService {
    private static instance: LoggingService | null = null;
    private loggerConfig?: LoggerConfig;
    private loggerStyleService?: LoggerStyleService;
    private registrationService: RegistrationService;

    // Constructeur privé pour empêcher l'instanciation directe
    private constructor() {
        this.registrationService = RegistrationService.getInstance();}

    // Méthode pour obtenir l'instance singleton
    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    // Initialisation du service de log avec configuration
    public init(loggerConfig: LoggerConfig): void {
        this.loggerConfig = loggerConfig;
        StyleConfigManager.getInstance().updateStyleConfig(loggerConfig);
        this.loggerStyleService = new LoggerStyleService();
    }

    // Méthode statique pour initialiser le service de log
    public static initialize(loggerConfig: LoggerConfig, loggerStylesConfig?: LoggerStylesConfig): void {
        const instance = LoggingService.getInstance();
        instance.init(loggerConfig);
    }

    // Vérifie si le service de log a été initialisé
    public static isInitialized(): boolean {
        const instance = LoggingService.getInstance();
        return !!instance.loggerConfig;
    }

    // Mise à jour de la configuration du service de log
    public updateConfig(loggerConfig: LoggerConfig): void {
        this.init(loggerConfig);
    }

    public registerService(metadata: IServiceMetadata): string {
        return this.registrationService.registerService(metadata);
    }

    // Méthode pour logger les messages
    public log(serviceName: string, level: LogLevel, message: string): void {
        if (!this.loggerConfig || !this.loggerStyleService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before logging.");
        }

        // Utilisez RegistrationService pour récupérer les métadonnées du service
        const metadata = this.registrationService.findServiceMetadata(serviceName);
        if (!metadata) {
            console.error(`Service "${serviceName}" not registered.`);
            return;
        }

        if (this.shouldLog(level)) {
            const formattedMessage = this.loggerStyleService.formatMessage(metadata, level, message);
            this.processConsoleLog(formattedMessage);
        }
    }

    // Autres méthodes privées pour le fonctionnement interne du service de log
    private shouldLog(level: LogLevel): boolean {
        return this.loggerConfig ? level >= this.loggerConfig.logLevel : false;
    }

    private processConsoleLog(message: string): void {
        console.log(message);
    }
}
