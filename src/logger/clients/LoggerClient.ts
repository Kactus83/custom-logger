import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../types/ServiceMetadata";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";
import { LoggerConfig } from "../../models/LoggerConfig";
import { LoggerMode } from "../../types/LoggerMode";
import { MainProcessLoggerConfig } from "../../models/MainProcessLoggerClientConfig";
import { SubProcessLoggerConfig } from "../../models/SubProcessLoggerClientConfig";

export class LoggerClient {
    protected serviceName: string;
    protected mainProcessName?: string;
    protected loggerMode?: LoggerMode;
    protected logLevel?: LogLevel;

    constructor(config: MainProcessLoggerConfig | SubProcessLoggerConfig) {
        if (config instanceof MainProcessLoggerConfig) {
            this.serviceName = config.serviceName;
            this.loggerMode = config.loggerMode;
            this.logLevel = config.logLevel;
            this.initMainProcess();
        } else {
            this.serviceName = config.serviceName;
            this.mainProcessName = config.mainProcessName;
            this.initSubProcess();
        }
        this.register();
    }

    private initMainProcess(): void {
        if (!LoggingService.isInitialized() && this.loggerMode && this.logLevel) {
            const loggerConfig = new LoggerConfig(this.logLevel, this.loggerMode);
            LoggingService.initialize(loggerConfig);
        }
    }

    private initSubProcess(): void {
        // Aucune initialisation spécifique requise pour les sous-processus
    }

    private register(): void {
        const metadata = this.mainProcessName ? 
                         new SubProcessMetadata(this.serviceName, this.mainProcessName) : 
                         new MainProcessMetadata(this.serviceName);
        this.serviceName = LoggingService.getInstance().registerService(metadata);
    }

    public log(level: LogLevel, message: string): void {
        LoggingService.getInstance().log(this.serviceName, level, message);
    }
}
