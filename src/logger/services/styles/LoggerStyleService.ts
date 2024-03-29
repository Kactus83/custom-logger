import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { LogLevel } from "../../../types/LogLevel";
import { TerminalStyles } from "../../../types/TerminalStyles";
import { StyleConfigManager } from "./StyleConfigManager";
import { ColorChoice } from "../../../types/TerminalColors";
import { ProcessDatabase } from "../../../models/process/ProcessDatabase";
import { LoggerConfig } from "../../../models/LoggerConfig";
import { LoggerDetailsLevel } from "../../../types/LoggerDetailsLevel";

/**
 * LoggerStyleService is responsible for styling and formatting the log messages
 * based on the process hierarchy and logger configuration. It utilizes style configurations
 * to apply terminal styles and formats messages to include timestamps, log level tags,
 * service names, and hierarchical structures as per the logger details level.
 */
export class LoggerStyleService {
    private processDatabase: ProcessDatabase;
    private loggerConfig: LoggerConfig;

    /**
     * Constructeur de LoggerStyleService.
     * @param {ProcessDatabase} processDatabase - Base de données des process pour trouver les métadonnées.
     * @param {LoggerConfig} loggerConfig - Configuration actuelle du logger.
     */
    constructor(processDatabase: ProcessDatabase, loggerConfig: LoggerConfig) {
        this.processDatabase = processDatabase;
        this.loggerConfig = loggerConfig;
    }

    
    /**
     * Formate un message de log basé sur l'ID du processus, le niveau de log et le message lui-même.
     * @param {string} processID - ID du processus.
     * @param {LogLevel} level - Niveau de log.
     * @param {string} message - Message à logger.
     * @returns {string} Message formaté.
     */
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

        const timestamp = this.loggerConfig.showTimestamp ? this.formatTimestamp() : "";
        const logLevelTag = this.getAlignedLogLevelTag(level);
        const parentTag = this.getServiceTag(processID);
        const hierarchySeparator = this.getHierarchySeparatorWithAlignment(timestamp);
        const serviceNameTag = this.formatServiceTag(metadata.serviceName);
        const separator = "-";

        const timestampStyles = stylesConfig.timestamp.getStyles(isMainProcess, level);
        const logLevelStyles = stylesConfig.logLevel.getStyles(isMainProcess, level);
        const parentTagStyles = stylesConfig.serviceName.getStyles(isMainProcess, level); // créer style unique si necessaire
        const hierarchySeparatorStyles = stylesConfig.message.getStyles(isMainProcess, level); // créer style unique si necessaire
        const serviceNameStyles = stylesConfig.serviceName.getStyles(isMainProcess, level);
        const separatorStyles = stylesConfig.message.getStyles(isMainProcess, level); // créer style unique si necessaire
        const messageStyles = stylesConfig.message.getStyles(isMainProcess, level);

        const formattedTimestamp = this.applyStyle(timestamp, timestampStyles, colorCode);
        const formattedLogLevelTag = this.applyStyle(logLevelTag, logLevelStyles, colorCode);
        const formattedParentTag = this.loggerConfig.showHierarchy ? this.applyStyle(parentTag, parentTagStyles, colorCode) : "";
        const formatedHierarchySeparator = this.applyStyle(hierarchySeparator, hierarchySeparatorStyles, colorCode);
        const formattedServiceNameTag = this.applyStyle(serviceNameTag, serviceNameStyles, colorCode);
        const formattedSeparator = this.applyStyle(separator, separatorStyles, colorCode);
        const formattedMessage = this.applyStyle(message, messageStyles, colorCode);

        // Construit le message final en conditionnant l'inclusion de serviceNameTag
        let finalMessage = "";
        if (this.loggerConfig.detailsLevel === LoggerDetailsLevel.DETAILED && this.loggerConfig.showHierarchy) {
            // En mode détaillé avec hiérarchie, inclut la hiérarchie complète sans répéter le tag du service actuel
            finalMessage = `${formattedTimestamp} ${formattedLogLevelTag} ${formattedParentTag}${formatedHierarchySeparator} ${formattedSeparator} ${formattedMessage}`;
        } else {
            // Dans les autres cas, inclut le tag du service actuel
            finalMessage = `${formattedTimestamp} ${formattedLogLevelTag} ${formattedParentTag}${formatedHierarchySeparator}${formattedServiceNameTag} ${formattedSeparator} ${formattedMessage}`;
        }
        
        // Ajoute un saut de ligne pour les logs en mode détaillé
        return this.loggerConfig.detailsLevel === LoggerDetailsLevel.DETAILED ? finalMessage + "\n" : finalMessage;
    }

    /**
     * Formats the current timestamp for inclusion in the log message.
     * @returns {string} The formatted timestamp.
     */
    private formatTimestamp(): string {
        if (this.loggerConfig.showTimestamp) {
            const now = new Date();
            return `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
        }
        return "";
    }

    /**
     * Aligns the log level tag to ensure consistent width across messages.
     * @param {LogLevel} level - The log level to format.
     * @returns {string} The aligned log level tag.
     */
    private getAlignedLogLevelTag(level: LogLevel): string {
        const maxLogLevelTagLength = Math.max(...Object.values(LogLevel).filter(value => typeof value === 'string').map(tag => `[${tag}]`.length));
        let logLevelTag = `[${LogLevel[level]}]`;
        logLevelTag = logLevelTag.padEnd(maxLogLevelTagLength, ' ');
        return logLevelTag;
    }

    /**
     * Generates the appropriate service tag based on the process hierarchy and
     * the logger details level.
     * @param {string} processID - The unique identifier for the logging process.
     * @returns {string} The formatted service tag or hierarchy.
     */
    private getServiceTag(processID: string): string {
        if (!this.loggerConfig.showHierarchy) {
            return ""; // Si showHierarchy est false, retourne une chaîne vide
        }
    
        // Si showHierarchy est true, détermine le contenu basé sur le detailsLevel
        switch (this.loggerConfig.detailsLevel) {
            case LoggerDetailsLevel.DETAILED:
                // En mode détaillé, construit et retourne la hiérarchie complète
                return this.buildCompleteHierarchyTags(processID);
            case LoggerDetailsLevel.DEFAULT:
            case LoggerDetailsLevel.LIGHT:
                // En mode default et light, retourne le tag du parent direct si disponible
                const processNode = this.processDatabase.findProcessById(processID);
                const parentID = processNode && processNode.metadata instanceof SubProcessMetadata ? processNode.metadata.mainProcessId : null;
                if (parentID) {
                    const parentMetadata = this.processDatabase.findProcessById(parentID)?.metadata;
                    return parentMetadata ? this.formatServiceTag(parentMetadata.serviceName) : "";
                }
                return ""; // Si pas de parent, retourne une chaîne vide
            default:
                return ""; // Gestion par défaut
        }
    }    

    /**
     * Builds a complete hierarchy string for the given process by traversing its parentage.
     * @param {string} processID - The unique identifier for the logging process.
     * @returns {string} The complete hierarchy string.
     */
    private buildCompleteHierarchyTags(processID: string): string {
        let hierarchy = "";
        let currentID = processID;
    
        while (currentID) {
            const node = this.processDatabase.findProcessById(currentID);
            if (!node) break;
    
            const formattedTag = this.formatServiceTag(node.metadata.serviceName, false);
            hierarchy = formattedTag + (hierarchy ? " -> " + hierarchy : "");
    
            if (node.metadata instanceof SubProcessMetadata && node.metadata.mainProcessId) {
                currentID = node.metadata.mainProcessId;
            } else {
                break;
            }
        }
    
        return hierarchy;
    }

    /**
     * Formats the service name tag, adjusting its length according to configuration.
     * @param {string} serviceName - The name of the service.
     * @param {boolean} adjustLength - Whether to adjust the length of the tag.
     * @returns {string} The formatted service name tag.
     */
    private formatServiceTag(serviceName: string, adjustLength: boolean = true): string {
        if (adjustLength) {
            // Prendre le minimum entre la longueur maximale configurée et la longueur maximale enregistrée dans la base de données
            const maxLength = Math.min(this.processDatabase.getMaxServiceNameLength() + 2, this.loggerConfig.tagsMaxLength + 2); // +2 pour les crochets
            let formattedName = `[${serviceName}]`;
            
            // Tronquer le nom de service si nécessaire pour respecter la longueur maximale
            if (formattedName.length > maxLength) {
                formattedName = `[${serviceName.substring(0, maxLength - 3)}...]`; // -3 pour inclure les points de suspension
            }
            
            // Compléter le tag pour qu'il atteigne la longueur maximale, en assurant l'alignement
            return formattedName.padEnd(maxLength, ' ');
        } else {
            // Laisser le tag intact sans ajustement de longueur
            return `[${serviceName}]`;
        }
    }

    /**
     * Determines the hierarchy separator based on the logger details level and formats it accordingly.
     * @param {string} formattedTimestamp - The formatted timestamp to align with.
     * @returns {string} The formatted hierarchy separator.
     */
    private getHierarchySeparatorWithAlignment(formattedTimestamp: string): string {
        let separator = this.loggerConfig.detailsLevel === LoggerDetailsLevel.DETAILED ? "\n \n" : " -> ";
    
        return separator;
    }
              

    /**
     * Applies the specified styles to the text and wraps it with the appropriate color code.
     * @param {string} text - The text to style.
     * @param {TerminalStyles[]} styles - The terminal styles to apply.
     * @param {string} colorCode - The terminal color code.
     * @returns {string} The styled text.
     */
    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }
}

