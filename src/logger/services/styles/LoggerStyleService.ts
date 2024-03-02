import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { LoggerStylesConfig } from "../../../models/LoggerStylesConfig";
import { LogLevel } from "../../../types/LogLevel";
import { TerminalStyles } from "../../../types/TerminalStyles";
import { StyleConfigManager } from "./StyleConfigManager";

export class LoggerStyleService {

    public formatMessage(metadata: IServiceMetadata, level: LogLevel, message: string): string {
        const stylesConfig = StyleConfigManager.getInstance().getLoggerStylesConfig();
        const isMainProcess = this.isMainProcessMetadata(metadata);

        const colorCode = this.getColorCode(metadata, stylesConfig, isMainProcess);
    
        // Récupérez directement les styles nécessaires à partir de la configuration
        const timestampStyles = stylesConfig.timestamp.getStyles(isMainProcess, level); 
        const logLevelStyles = stylesConfig.logLevel.getStyles(isMainProcess, level);
        const serviceNameStyles = stylesConfig.serviceName.getStyles(isMainProcess, level); 
        const messageStyles = stylesConfig.message.getStyles(isMainProcess, level);
    
        // Formatage des différentes parties du message
        const now = new Date();
        const timestamp = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
        const logLevelTag = `[${LogLevel[level]}]`;
        const serviceNameTag = `[${metadata.serviceName}]`;
    
        // Appliquez les styles et la couleur à chaque partie du message
        const formattedTimestamp = this.applyStyle(timestamp, timestampStyles, colorCode);
        const formattedLogLevelTag = this.applyStyle(logLevelTag, logLevelStyles, colorCode);
        const formattedServiceNameTag = this.applyStyle(serviceNameTag, serviceNameStyles, colorCode);
        const formattedMessage = this.applyStyle(message, messageStyles, colorCode);
    
        return `${formattedTimestamp} ${formattedLogLevelTag} ${formattedServiceNameTag} - ${formattedMessage}`;
    }

    private isMainProcessMetadata(metadata: IServiceMetadata): boolean {
        return metadata instanceof MainProcessMetadata;
    }

    private getColorCode(metadata: IServiceMetadata, stylesConfig: LoggerStylesConfig, isMainProcess: boolean): string {
        const color = isMainProcess ? stylesConfig.mainProcessColor : stylesConfig.subProcessColor;
        return stylesConfig.colorMapping[color];
    }

    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }
}
