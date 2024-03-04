import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { LogLevel } from "../../../types/LogLevel";
import { TerminalStyles } from "../../../types/TerminalStyles";
import { StyleConfigManager } from "./StyleConfigManager";
import { ColorChoice } from "../../../types/TerminalColors";
import { ProcessDatabase } from "@models/process/ProcessDatabase";
import { LoggerConfig } from "@models/LoggerConfig";


export class LoggerStyleService {
    private processDatabase: ProcessDatabase;
    private loggerConfig: LoggerConfig;

    constructor(processDatabase: ProcessDatabase, loggerConfig: LoggerConfig) {
        this.processDatabase = processDatabase;
        this.loggerConfig = loggerConfig;
    }

    public formatMessage(processID: string, level: LogLevel, message: string): string {
        const processNode = this.processDatabase.findProcessById(processID);
        if (!processNode) {
            console.error(`Process with ID "${processID}" not registered.`);
            return "";
        }

        const metadata = processNode.metadata;
        const parentMetadata = metadata instanceof SubProcessMetadata ? this.processDatabase.findProcessById(metadata.mainProcessId)?.metadata : null;
        const stylesConfig = StyleConfigManager.getInstance().getLoggerStylesConfig();
        const colorCode = metadata.color ? stylesConfig.colorMapping[metadata.color] : stylesConfig.colorMapping[ColorChoice.White];
        const isMainProcess = metadata instanceof MainProcessMetadata;

        const timestamp = this.loggerConfig.showTimestamp ? `[${new Date().toTimeString().split(' ')[0]}]` : "";
        const logLevelTag = this.getAlignedLogLevelTag(level);
        const parentTag = parentMetadata ? `[${parentMetadata.serviceName}] -->` : "[MAIN PROCESS]";
        const serviceNameTag = `[${metadata.serviceName}]`;
        const separator = "-";

        const timestampStyles = stylesConfig.timestamp.getStyles(isMainProcess, level);
        const logLevelStyles = stylesConfig.logLevel.getStyles(isMainProcess, level);
        const parentTagStyles = stylesConfig.serviceName.getStyles(isMainProcess, level); // créer style unique si necessaire
        const serviceNameStyles = stylesConfig.serviceName.getStyles(isMainProcess, level);
        const separatorStyles = stylesConfig.message.getStyles(isMainProcess, level); // créer style unique si necessaire
        const messageStyles = stylesConfig.message.getStyles(isMainProcess, level);

        const formattedTimestamp = this.applyStyle(timestamp, timestampStyles, colorCode);
        const formattedLogLevelTag = this.applyStyle(logLevelTag, logLevelStyles, colorCode);
        const formattedParentTag = this.loggerConfig.showHierarchy ? this.applyStyle(parentTag, parentTagStyles, colorCode) : "";
        const formattedServiceNameTag = this.applyStyle(serviceNameTag, serviceNameStyles, colorCode);
        const formattedSeparator = this.applyStyle(separator, separatorStyles, colorCode);
        const formattedMessage = this.applyStyle(message, messageStyles, colorCode);

        return `${formattedTimestamp} ${formattedLogLevelTag} ${formattedParentTag} ${formattedServiceNameTag} ${formattedSeparator} ${formattedMessage}`;
    }

    private getAlignedLogLevelTag(level: LogLevel): string {
        const maxLogLevelTagLength = Math.max(...Object.values(LogLevel).filter(value => typeof value === 'string').map(tag => `[${tag}]`.length));
        let logLevelTag = `[${LogLevel[level]}]`;
        logLevelTag = logLevelTag.padEnd(maxLogLevelTagLength, ' ');
        return logLevelTag;
    }

    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }
}

