import { LoggerConfig } from "../models/LoggerConfig";
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import { LogLevel } from "../types/LogLevel";
import { StyleConfigManager } from "./services/styles/StyleConfigManager";
import { RegistrationService } from "./services/registration/RegistrationService";
import { IServiceMetadata } from "../types/ServiceMetadata";
import { ProcessDatabase } from "../models/process/ProcessDatabase";
import { ProcessesColorsService } from "./services/styles/ProcessesColorsService";
import { MessageFormatterService } from "./services/format/MessageFormatterService";

/**
 * Classe LoggingService - Service de journalisation centralisé pour l'application.
 * Utilise le motif Singleton pour s'assurer qu'une seule instance du service est créée.
 */
export class LoggingService {
    private static instance: LoggingService | null = null;
    private processDatabase: ProcessDatabase = new ProcessDatabase();
    private loggerConfig?: LoggerConfig;
    private loggerStyleService?: LoggerStyleService;
    private processesColorsService?: ProcessesColorsService;
    private registrationService?: RegistrationService;


    /**
     * Constructeur privé pour empêcher l'instanciation directe et forcer l'utilisation de getInstance().
     */
    private constructor() {
    }

    /**
     * Obtient l'instance unique du LoggingService, en la créant si elle n'existe pas déjà.
     * @returns {LoggingService} L'instance unique du LoggingService.
     */
    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    /**
     * Initialise le service de journalisation avec une configuration spécifique.
     * @param {LoggerConfig} loggerConfig - La configuration à utiliser pour le service de journalisation.
     */
    public init(loggerConfig: LoggerConfig): void {
        this.loggerConfig = loggerConfig;
        StyleConfigManager.getInstance().updateStyleConfig(loggerConfig);
        this.loggerStyleService = new LoggerStyleService(this.processDatabase, this.loggerConfig);
        this.processesColorsService = new ProcessesColorsService(this.loggerConfig.loggerMode);
        this.registrationService = new RegistrationService(this.processDatabase, this.processesColorsService);
    }

    /**
     * Méthode statique pour initialiser le service de log. Facilite l'accès à l'initialisation sans nécessiter d'instance.
     * @param {LoggerConfig} loggerConfig - Configuration du logger.
     * @param {LoggerStylesConfig} [loggerStylesConfig] - Configuration optionnelle des styles de logger.
     */
    public static initialize(loggerConfig: LoggerConfig, loggerStylesConfig?: LoggerStylesConfig): void {
        const instance = LoggingService.getInstance();
        instance.init(loggerConfig);
    }

    /**
     * Vérifie si le service de log a été correctement initialisé.
     * @returns {boolean} True si le service est initialisé, false sinon.
     */
    public static isInitialized(): boolean {
        const instance = LoggingService.getInstance();
        return !!instance.loggerConfig && !!instance.loggerStyleService && !!instance.registrationService && !!instance.processesColorsService;
    }

    /**
     * Met à jour la configuration du service de log.
     * @param {LoggerConfig} loggerConfig - Nouvelle configuration du logger.
     */
    public updateConfig(loggerConfig: LoggerConfig): void {
        this.init(loggerConfig);
    }

    /**
     * Enregistre un service au sein du système de log, en lui attribuant un identifiant unique.
     * @param {IServiceMetadata} metadata - Métadonnées du service à enregistrer.
     * @returns {string} Identifiant unique du service enregistré.
     */
    public registerService(metadata: IServiceMetadata): string {
        if(!this.registrationService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before registering services.");
        }
        return this.registrationService.registerService(metadata);
    }

    /**
     * Méthode principale pour logger les messages. Accepte divers types de messages et les traite en conséquence.
     * @param {string} processId - Identifiant du processus qui log le message.
     * @param {LogLevel} level - Niveau de log du message.
     * @param {...(string | number | boolean | object)} messages - Messages à logger.
     */
    public log(processId: string, level: LogLevel, ...messages: (string | number | boolean | object)[]): void {
        if (!this.loggerConfig || !this.loggerStyleService || !this.registrationService || !this.processesColorsService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before logging.");
        }
    
        if (this.shouldLog(level)) {
            const formattedMessage = this.loggerStyleService.formatMessage(processId, level, MessageFormatterService.formatMessages(...messages));
            this.processConsoleLog(formattedMessage);
        }
    }       

    /**
     * Détermine si un message doit être loggé en fonction du niveau de log configuré.
     * @param {LogLevel} level - Niveau de log du message à évaluer.
     * @returns {boolean} True si le message doit être loggé, false sinon.
     */
    private shouldLog(level: LogLevel): boolean {
        return this.loggerConfig ? level >= this.loggerConfig.logLevel : false;
    }

    /**
     * Affiche le message formaté dans la console.
     * @param {string} message - Message formaté à afficher.
     */
    private processConsoleLog(message: string): void {
        console.log(message);
    }
}
