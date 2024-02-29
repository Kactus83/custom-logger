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
        // Format chaque partie du message de log séparément
        const timestamp = this.formatTimestamp();
        const logLevelTag = this.formatLogLevelTag(level, processMetadata.isMainProcess);
        const serviceNameTag = this.formatServiceNameTag(processMetadata.serviceName, processMetadata.isMainProcess);
        const formattedMessage = this.formatMessageContent(message, level, processMetadata.isMainProcess);

        return `${timestamp} ${logLevelTag} ${serviceNameTag} - ${formattedMessage}`;
    }

    private formatTimestamp(): string {
        const now = new Date();
        const styles = this.stylesConfig.timestamp.getStyle(false, 'DEFAULT');
        return this.applyStyle(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`, styles);
    }

    private formatLogLevelTag(level: LogLevel, isMainProcess: boolean): string {
        const styles = this.stylesConfig.logLevel.getStyle(isMainProcess, level);
        return this.applyStyle(`[${LogLevel[level]}]`, styles);
    }

    private formatServiceNameTag(serviceName: string, isMainProcess: boolean): string {
        const styles = this.stylesConfig.serviceName.getStyle(isMainProcess, 'DEFAULT');
        return this.applyStyle(`[${serviceName}]`, styles);
    }

    private formatMessageContent(message: string, level: LogLevel, isMainProcess: boolean): string {
        const styles = this.stylesConfig.message.getStyle(isMainProcess, level);
        return this.applyStyle(message, styles);
    }

    private applyStyle(text: string, styles: TerminalStyles[]): string {
        const styleCodes = styles.map(style => {
            // Glitch pour le compilateur (trouver mieux)
            const key = style as unknown as keyof typeof TerminalStyles;
            return TerminalStyles[key];
        }).join('');
        const resetStyle = TerminalStyles.Reset;
        return `${styleCodes}${text}${resetStyle}`;
    }
    
    
    
    public updateStyleConfig(newConfig: LoggerStylesConfig): void {
        this.stylesConfig = newConfig;
    }
    
}
