import { LoggerMode } from "../../../types/LoggerMode";
import { LoggerStylesConfig } from "../../../models/LoggerStylesConfig";
import { LogLevel } from "../../../types/LogLevel";
import ServiceMetadata from "../../../types/ServiceMetadata";

export class LoggerStyleService {

    private loggerMode: LoggerMode;
    private stylesConfig: LoggerStylesConfig;

    constructor(stylesConfig: LoggerStylesConfig, loggerMode: LoggerMode) {
        this.stylesConfig = stylesConfig;
        this.loggerMode = loggerMode;
    }

    public formatMessage(processMetadatas: ServiceMetadata, level: LogLevel, message: string): string {
        return message;
    }

    public updateStyleConfig(newConfig: LoggerStylesConfig): void {
        this.stylesConfig = newConfig;
    }

    // Méthodes utilitaires pour déterminer le style ici...
}
