import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ColorChoice } from "../../../types/TerminalColors";

/**
 * Service responsible for assigning colors to different processes.
 * Assigns colors to processes based on the logging mode.
 */
export class ProcessesColorsService {
    private colorUsageCount: Map<ColorChoice, number> = new Map();
    private loggerMode: LoggerMode;

    /**
     * Initializes the service with the specified logging mode.
     * @param {LoggerMode} loggerMode - The logging mode (CLASSIC, COLORED, DOCKER).
     */
    constructor(loggerMode: LoggerMode) {
        this.loggerMode = loggerMode;
        this.initializeColorUsageCount();
    }
        
    /**
     * Assigns a color to a process (and its sub-processes if necessary) based on the logging mode.
     * @param {IServiceMetadata} metadata - The metadata of the process.
     * @param {IServiceMetadata} [parentProcessMetadata] - The metadata of the parent process (optional).
     * @returns {IServiceMetadata} The metadata of the process with the assigned color.
     */
    public setColorForProcess(metadata: IServiceMetadata, parentProcessMetadata?: IServiceMetadata): IServiceMetadata {
        switch (this.loggerMode) {
            case LoggerMode.CLASSIC:
                metadata.color = ColorChoice.White;
                break;
            case LoggerMode.COLORED:
                if (parentProcessMetadata instanceof SubProcessMetadata) {
                    // If the parent is a SubProcess, inherit the color from the parent
                    metadata.color = parentProcessMetadata.color;
                } else {
                    // If the parent is a MainProcess or there is no parent, assign a new unique color
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
     * Initializes the color usage count.
     * Excludes certain colors and initializes the count to zero for the others.
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
     * Assigns a unique color to the process by choosing the least used color.
     * @returns {ColorChoice} The chosen color.
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

        // Update the usage count for the chosen color
        this.colorUsageCount.set(leastUsedColor, this.colorUsageCount.get(leastUsedColor)! + 1);

        return leastUsedColor;
    }
}
