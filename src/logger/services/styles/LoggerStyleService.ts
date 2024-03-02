import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { LoggerStylesConfig } from "../../../models/LoggerStylesConfig";
import { LogLevel } from "../../../types/LogLevel";
import { TerminalStyles } from "../../../types/TerminalStyles";
import { StyleConfigManager } from "./StyleConfigManager";
import { LoggerMode } from "../../../types/LoggerMode";
import { ColorChoice } from "../../../types/TerminalColors";

export class LoggerStyleService {
    private colorUsageCount: Map<ColorChoice, number> = new Map();

    public formatMessage(metadata: IServiceMetadata, level: LogLevel, message: string): string {
        const stylesConfig = StyleConfigManager.getInstance().getLoggerStylesConfig();
        const colorCode = metadata.color ? stylesConfig.colorMapping[metadata.color] : stylesConfig.colorMapping[ColorChoice.White];
        const isMainProcess = this.isMainProcessMetadata(metadata);
    
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

    private applyStyle(text: string, styles: TerminalStyles[], colorCode: string): string {
        const styleCodes = styles.join('');
        return `${colorCode}${styleCodes}${text}${TerminalStyles.Reset}`;
    }

    public setColorForProcess(metadata: IServiceMetadata, loggerMode: LoggerMode, mainProcessMetadata?: MainProcessMetadata): IServiceMetadata {
        // Accéder à la configuration des styles pour obtenir le mappage des couleurs actuel
        const stylesConfig = StyleConfigManager.getInstance().getLoggerStylesConfig();
        
        // Déterminer la couleur en fonction du mode de journalisation
        switch (loggerMode) {
            case LoggerMode.CLASSIC:
                // En mode CLASSIC, tous les processus peuvent être définis à une couleur standard, par exemple White
                metadata.color = ColorChoice.White;
                break;
            case LoggerMode.COLORED:
                // En mode COLORED, attribuez une couleur unique à chaque processus
                metadata.color = this.assignUniqueColor();
                break;
            case LoggerMode.DOCKER:
                if (metadata instanceof SubProcessMetadata && mainProcessMetadata) {
                    metadata.color = mainProcessMetadata.color ?? this.assignUniqueColor();
                } else if (!metadata.color) {
                    metadata.color = this.assignUniqueColor();
                }
                break;
            default:
                // Le mode DEFAULT peut être traité de la même manière que le mode CLASSIC ou selon une logique spécifique
                metadata.color = ColorChoice.White;
        }
    
        return metadata;
    }
    
    private initializeColorUsageCount() {
        // Initialisation du compteur d'utilisation pour chaque couleur disponible
        [ColorChoice.Red, ColorChoice.Green, ColorChoice.Yellow, ColorChoice.Blue, ColorChoice.Magenta, ColorChoice.Cyan].forEach(color => {
            this.colorUsageCount.set(color, 0);
        });
    }
    
    private assignUniqueColor(): ColorChoice {
        // S'assurer que le compteur d'utilisation est initialisé
        if (this.colorUsageCount.size === 0) {
            this.initializeColorUsageCount();
        }
    
        // Trouver la couleur la moins utilisée
        let leastUsedColor: ColorChoice = ColorChoice.Red;
        let leastUsage = Infinity;
    
        this.colorUsageCount.forEach((usage, color) => {
            if (usage < leastUsage) {
                leastUsedColor = color;
                leastUsage = usage;
            }
        });
    
        // Mettre à jour le compteur d'utilisation pour la couleur choisie
        this.colorUsageCount.set(leastUsedColor, leastUsage + 1);
    
        return leastUsedColor;
    }
    
}

