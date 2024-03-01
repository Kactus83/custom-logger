import { LoggerMode } from "../../../types/LoggerMode";
import { LoggerStylesConfig } from "../../../models/LoggerStylesConfig";
import { LogLevel } from "../../../types/LogLevel";
import ServiceMetadata from "../../../types/ServiceMetadata";
import { TerminalStyles } from "../../../types/TerminalStyles";

export class LoggerStyleService {
    private loggerMode: LoggerMode;
    private stylesConfig: LoggerStylesConfig;

    constructor(stylesConfig: LoggerStylesConfig, loggerMode: LoggerMode) {
        this.stylesConfig = stylesConfig;
        this.loggerMode = loggerMode;
    }

    public formatMessage(processMetadata: ServiceMetadata, level: LogLevel, message: string): string {
        const colorCode = this.getColorCode(processMetadata);
    
        // Récupérez directement les styles nécessaires à partir de la configuration
        const timestampStyles = this.stylesConfig.timestamp.getStyles(processMetadata.isMainProcess, LogLevel.INFO); // INFO ou un autre niveau par défaut pour le timestamp
        const logLevelStyles = this.stylesConfig.logLevel.getStyles(processMetadata.isMainProcess, level);
        const serviceNameStyles = this.stylesConfig.serviceName.getStyles(processMetadata.isMainProcess, LogLevel.INFO); // INFO pour simplifier
        const messageStyles = this.stylesConfig.message.getStyles(processMetadata.isMainProcess, level);
    
        // Formatage des différentes parties du message
        const now = new Date();
        const timestamp = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
        const logLevelTag = `[${LogLevel[level]}]`;
        const serviceNameTag = `[${processMetadata.serviceName}]`;
    
        // Appliquez les styles et la couleur à chaque partie du message
        const formattedTimestamp = this.applyStyle(timestamp, timestampStyles, colorCode);
        const formattedLogLevelTag = this.applyStyle(logLevelTag, logLevelStyles, colorCode);
        const formattedServiceNameTag = this.applyStyle(serviceNameTag, serviceNameStyles, colorCode);
        const formattedMessage = this.applyStyle(message, messageStyles, colorCode);
    
        return `${formattedTimestamp} ${formattedLogLevelTag} ${formattedServiceNameTag} - ${formattedMessage}`;
    }

    private getColorCode(metadata: ServiceMetadata): string {
        const color = metadata.isMainProcess ? this.stylesConfig.mainProcessColor : this.stylesConfig.subProcessColor;
        return this.stylesConfig.colorMapping[color];
    }

    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }
}
