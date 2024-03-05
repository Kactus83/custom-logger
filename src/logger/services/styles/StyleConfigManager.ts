import { LoggerConfig } from "../../../models/LoggerConfig";
import { LoggerStylesConfig, LoggerStylesConfigOptions } from "../../../models/LoggerStylesConfig";
import { classicOptions, coloredOptions, dockerOptions } from "../../../models/LoggerStylesConfigLib";
import { LoggerMode } from "../../../types/LoggerMode";

/**
 * Manages the logging styles configuration for the application.
 * Uses the Singleton pattern to ensure that only one instance of this class is created.
 */
export class StyleConfigManager {
    private static instance: StyleConfigManager;
    private loggerStylesConfig: LoggerStylesConfig;

    /**
     * Private constructor to prevent direct instantiation and force the use of getInstance().
     */
    private constructor() {
        this.loggerStylesConfig = new LoggerStylesConfig();
    }

    /**
     * Gets the unique instance of StyleConfigManager.
     * @returns {StyleConfigManager} The singleton instance of StyleConfigManager.
     */
    public static getInstance(): StyleConfigManager {
        if (!this.instance) {
            this.instance = new StyleConfigManager();
        }
        return this.instance;
    }

    /**
     * Updates the style configuration based on the specified logging mode.
     * @param {LoggerConfig} loggerConfig - The logger configuration including the logging mode.
     */
    public updateStyleConfig(loggerConfig: LoggerConfig): void {
        let styleConfigOptions: LoggerStylesConfigOptions;
        switch (loggerConfig.loggerMode) {
            case LoggerMode.CLASSIC:
                styleConfigOptions = classicOptions;
                break;
            case LoggerMode.COLORED:
                styleConfigOptions = coloredOptions;
                break;
            case LoggerMode.DOCKER:
                styleConfigOptions = dockerOptions;
                break;
            default:
                return
        }

        this.loggerStylesConfig.updateConfig(styleConfigOptions);
    }

    /**
     * Returns the current logging styles configuration.
     * @returns {LoggerStylesConfig} The current styles configuration.
     */
    public getLoggerStylesConfig(): LoggerStylesConfig {
        return this.loggerStylesConfig;
    }
}
