import { LoggerConfig } from "../models/LoggerConfig";
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import { LogLevel } from "../types/LogLevel";
import { StyleConfigManager } from "./services/styles/StyleConfigManager";
import { RegistrationService } from "./services/registration/RegistrationService";
import { IServiceMetadata } from "../types/ServiceMetadata";
import { ProcessDatabase } from "../models/process/ProcessDatabase";
import { ProcessesColorsService } from "./services/styles/ProcessesColorsService";

export class LoggingService {
    private static instance: LoggingService | null = null;
    private processDatabase: ProcessDatabase = new ProcessDatabase();
    private loggerConfig?: LoggerConfig;
    private loggerStyleService?: LoggerStyleService;
    private processesColorsService?: ProcessesColorsService;
    private registrationService?: RegistrationService;


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
    public init(loggerConfig: LoggerConfig): void {
        this.loggerConfig = loggerConfig;
        StyleConfigManager.getInstance().updateStyleConfig(loggerConfig);
        this.loggerStyleService = new LoggerStyleService();
        this.processesColorsService = new ProcessesColorsService(this.loggerConfig.loggerMode);
        this.registrationService = new RegistrationService(this.processDatabase, this.processesColorsService);
    }

    // Méthode statique pour initialiser le service de log
    public static initialize(loggerConfig: LoggerConfig, loggerStylesConfig?: LoggerStylesConfig): void {
        const instance = LoggingService.getInstance();
        instance.init(loggerConfig);
    }

    // Vérifie si le service de log a été initialisé
    public static isInitialized(): boolean {
        const instance = LoggingService.getInstance();
        return !!instance.loggerConfig && !!instance.loggerStyleService && !!instance.registrationService && !!instance.processesColorsService;
    }

    // Mise à jour de la configuration du service de log
    public updateConfig(loggerConfig: LoggerConfig): void {
        this.init(loggerConfig);
    }

    public registerService(metadata: IServiceMetadata): string {
        if(!this.registrationService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before registering services.");
        }
        return this.registrationService.registerService(metadata);
    }

    // Méthode pour logger les messages
    public log(processId: string, level: LogLevel, message: string): void {
        if (!this.loggerConfig || !this.loggerStyleService || !this.registrationService || !this.processesColorsService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before logging.");
        }

        // Utilisez RegistrationService pour récupérer les métadonnées du service
        const processNode = this.processDatabase.findProcessById(processId);
        if (!processNode) {
            console.error(`Process with ID "${processId}" not registered.`);
            return;
        }

        if (this.shouldLog(level)) {
            const formattedMessage = this.loggerStyleService.formatMessage(processNode.metadata, level, message);
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
