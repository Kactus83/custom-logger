import { LoggerStylesConfig } from "../../../models/LoggerStylesConfig";
import { LogLevel } from "../../../types/LogLevel";
import ServiceMetadata from "../../../types/ServiceMetadata";
import { TerminalStyles } from "../../../types/TerminalStyles";
import { StyleConfigManager } from "./StyleConfigManager";

export class LoggerStyleService {

    constructor() {
    }

    public formatMessage(processMetadata: ServiceMetadata, level: LogLevel, message: string): string {
        
        const stylesConfig = StyleConfigManager.getInstance().getLoggerStylesConfig();
        const colorCode = this.getColorCode(processMetadata, stylesConfig);
    
        // Récupérez directement les styles nécessaires à partir de la configuration
        const timestampStyles = stylesConfig.timestamp.getStyles(processMetadata.isMainProcess, level); 
        const logLevelStyles = stylesConfig.logLevel.getStyles(processMetadata.isMainProcess, level);
        const serviceNameStyles = stylesConfig.serviceName.getStyles(processMetadata.isMainProcess, level); 
        const messageStyles = stylesConfig.message.getStyles(processMetadata.isMainProcess, level);
    
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

    private getColorCode(metadata: ServiceMetadata, stylesConfig: LoggerStylesConfig): string {
        const color = metadata.isMainProcess ? stylesConfig.mainProcessColor : stylesConfig.subProcessColor;
        return stylesConfig.colorMapping[color];
    }

    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }
}
