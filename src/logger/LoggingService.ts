import { LoggerConfig } from "../models/LoggerConfig";
import { LoggerStylesConfig } from "../models/LoggerStylesConfig";
import { LoggerStyleService } from "./services/styles/LoggerStyleService";
import { LogLevel } from "../types/LogLevel";
import { StyleConfigManager } from "./services/styles/StyleConfigManager";
import { RegistrationService } from "./services/processes/RegistrationService";
import { IServiceMetadata } from "../types/ServiceMetadata";
import { ProcessDatabase } from "../models/process/ProcessDatabase";
import { ProcessesColorsService } from "./services/styles/ProcessesColorsService";
import { MessageFormatterService } from "./services/format/MessageFormatterService";
import { ProcessTreeVisualizationService } from "./services/processes/ProcessTreeVisualizationService";

/**
 * Class LoggingService - Centralized logging service for the application.
 * Uses the Singleton pattern to ensure that only one instance of the service is created.
 */
export class LoggingService {
    private static instance: LoggingService | null = null;
    private processDatabase: ProcessDatabase = new ProcessDatabase();
    private loggerConfig?: LoggerConfig;
    private loggerStyleService?: LoggerStyleService;
    private processesColorsService?: ProcessesColorsService;
    private registrationService?: RegistrationService;
    private processTreeVisualizationService?: ProcessTreeVisualizationService;


    /**
     * Private constructor to prevent direct instantiation and force the use of getInstance().
     */
    private constructor() {
    }

    /**
     * Gets the unique instance of LoggingService, creating it if it doesn't already exist.
     * @returns {LoggingService} The unique instance of LoggingService.
     */
    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    /**
     * Initializes the logging service with a specific configuration.
     * @param {LoggerConfig} loggerConfig - The configuration to use for the logging service.
     */
    public init(loggerConfig: LoggerConfig): void {
        this.loggerConfig = loggerConfig;
        StyleConfigManager.getInstance().updateStyleConfig(loggerConfig);
        this.loggerStyleService = new LoggerStyleService(this.processDatabase, this.loggerConfig);
        this.processesColorsService = new ProcessesColorsService(this.loggerConfig.loggerMode);
        this.registrationService = new RegistrationService(this.processDatabase, this.processesColorsService);
        this.processTreeVisualizationService = new ProcessTreeVisualizationService(this.processDatabase);
    }

    /**
     * Static method to initialize the logging service. Provides easy access to initialization without requiring an instance.
     * @param {LoggerConfig} loggerConfig - Logger configuration.
     * @param {LoggerStylesConfig} [loggerStylesConfig] - Optional logger styles configuration.
     */
    public static initialize(loggerConfig: LoggerConfig, loggerStylesConfig?: LoggerStylesConfig): void {
        const instance = LoggingService.getInstance();
        instance.init(loggerConfig);
    }

    /**
     * Checks if the logging service has been properly initialized.
     * @returns {boolean} True if the service is initialized, false otherwise.
     */
    public static isInitialized(): boolean {
        const instance = LoggingService.getInstance();
        return !!instance.loggerConfig && !!instance.loggerStyleService && !!instance.registrationService && !!instance.processesColorsService;
    }

    /**
     * Updates the configuration of the logging service.
     * @param {LoggerConfig} loggerConfig - The new logger configuration.
     */
    public updateConfig(loggerConfig: LoggerConfig): void {
        this.init(loggerConfig);
    }

    /**
     * Registers a service within the logging system, assigning it a unique identifier.
     * @param {IServiceMetadata} metadata - Metadata of the service to register.
     * @returns {string} Unique identifier of the registered service.
     */
    public registerService(metadata: IServiceMetadata): string {
        if(!this.registrationService) {
            throw new Error("LoggingService is not initialized. Call 'init' method before registering services.");
        }
        return this.registrationService.registerService(metadata);
    }
    /**
     * Displays the hierarchical structure of all process trees managed by the logging service.
     */
    public displayProcessTrees(): void {
        if (!this.processTreeVisualizationService) {
            console.error("ProcessTreeVisualizationService is not initialized.");
            return;
        }

        // Appel à la méthode displayProcessTrees du ProcessTreeVisualizationService
        this.processTreeVisualizationService.displayProcessTrees();
    }

    /**
     * Main method for logging messages. Accepts various types of messages and processes them accordingly.
     * @param {string} processId - Identifier of the process logging the message.
     * @param {LogLevel} level - Log level of the message.
     * @param {...(string | number | boolean | object)} messages - Messages to be logged.
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
     * Determines whether a message should be logged based on the configured log level.
     * @param {LogLevel} level - Log level of the message to evaluate.
     * @returns {boolean} True if the message should be logged, false otherwise.
     */
    private shouldLog(level: LogLevel): boolean {
        return this.loggerConfig ? level >= this.loggerConfig.logLevel : false;
    }

    /**
     * Displays the formatted message in the console.
     * @param {string} message - Formatted message to display.
     */
    private processConsoleLog(message: string): void {
        console.log(message);
    }
}
