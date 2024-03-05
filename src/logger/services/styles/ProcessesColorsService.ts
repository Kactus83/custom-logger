import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ColorChoice } from "../../../types/TerminalColors";

/**
 * Service en charge de l'attribution des couelurs aux différents process.
 * Attribue des couleurs aux processus en fonction du mode de journalisation.
 */
export class ProcessesColorsService {
    private colorUsageCount: Map<ColorChoice, number> = new Map();
    private loggerMode: LoggerMode;

    /**
     * Initialise le service avec le mode de journalisation spécifié.
     * @param {LoggerMode} loggerMode - Le mode de journalisation (CLASSIC, COLORED, DOCKER).
     */
    constructor(loggerMode: LoggerMode) {
        this.loggerMode = loggerMode;
        this.initializeColorUsageCount();
    }
        
    /**
     * Attribue une couleur à un processus (et ses sous-processus si nécessaire) en fonction du mode de journalisation.
     * @param {IServiceMetadata} metadata - Les métadonnées du processus.
     * @param {IServiceMetadata} [parentProcessMetadata] - Les métadonnées du processus parent (facultatif).
     * @returns {IServiceMetadata} Les métadonnées du processus avec la couleur attribuée.
     */
    public setColorForProcess(metadata: IServiceMetadata, parentProcessMetadata?: IServiceMetadata): IServiceMetadata {
        switch (this.loggerMode) {
            case LoggerMode.CLASSIC:
                metadata.color = ColorChoice.White;
                break;
            case LoggerMode.COLORED:
                if (parentProcessMetadata instanceof SubProcessMetadata) {
                    // Si le parent est un SubProcess, hériter la couleur du parent
                    metadata.color = parentProcessMetadata.color;
                } else {
                    // Si le parent est un MainProcess ou s'il n'y a pas de parent, assigner une nouvelle couleur unique
                    metadata.color = this.assignUniqueColor();
                }
                break;
            case LoggerMode.DOCKER:
                if (metadata instanceof SubProcessMetadata && parentProcessMetadata) {
                    metadata.color = parentProcessMetadata.color ?? this.assignUniqueColor();
                } else {
                    metadata.color = this.assignUniqueColor();
                }
                break;
            default:
                metadata.color = ColorChoice.White;
        }
        return metadata;
    }

    /**
     * Initialise le compteur d'utilisation des couleurs.
     * Exclut certaines couleurs et initialise le compteur à zéro pour les autres.
     */
    private initializeColorUsageCount() {
        const excludedColors = [ColorChoice.Black, ColorChoice.White];
        Object.values(ColorChoice)
            .filter(color => !excludedColors.includes(color))
            .forEach(color => {
                this.colorUsageCount.set(color, 0);
            });
    }

    /**
     * Attribue une couleur unique au processus en choisissant la couleur la moins utilisée.
     * @returns {ColorChoice} La couleur choisie.
     */
    private assignUniqueColor(): ColorChoice {
        let leastUsedColor: ColorChoice = ColorChoice.Red;
        let leastUsage = Infinity;

        this.colorUsageCount.forEach((usage, color) => {
            if (usage < leastUsage) {
                leastUsedColor = color;
                leastUsage = usage;
            }
        });

        // Mettre à jour le compteur d'utilisation pour la couleur choisie
        this.colorUsageCount.set(leastUsedColor, this.colorUsageCount.get(leastUsedColor)! + 1);

        return leastUsedColor;
    }
}
