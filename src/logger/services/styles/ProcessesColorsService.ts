import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ColorChoice } from "../../../types/TerminalColors";

export class ProcessesColorsService {
    private colorUsageCount: Map<ColorChoice, number> = new Map();
    private loggerMode: LoggerMode;

    constructor(loggerMode: LoggerMode) {
        this.loggerMode = loggerMode;
        this.initializeColorUsageCount();
    }
    
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

    private initializeColorUsageCount() {
        // Exclure Black, White et Random de la liste des couleurs initiales
        const excludedColors = [ColorChoice.Black, ColorChoice.White];
        Object.values(ColorChoice)
            .filter(color => !excludedColors.includes(color))
            .forEach(color => {
                this.colorUsageCount.set(color, 0);
            });
    }

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
