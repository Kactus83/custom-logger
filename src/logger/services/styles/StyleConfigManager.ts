import { LoggerConfig } from "../../../models/LoggerConfig";
import { LoggerStylesConfig, LoggerStylesConfigOptions } from "../../../models/LoggerStylesConfig";
import { classicOptions, coloredOptions, dockerOptions } from "../../../models/LoggerStylesConfigLib";
import { LoggerMode } from "../../../types/LoggerMode";

export class StyleConfigManager {
    private static instance: StyleConfigManager;
    private loggerStylesConfig: LoggerStylesConfig;

    private constructor() {
        this.loggerStylesConfig = new LoggerStylesConfig();
    }

    // Méthode pour obtenir l'instance singleton
    public static getInstance(): StyleConfigManager {
        if (!this.instance) {
            this.instance = new StyleConfigManager();
        }
        return this.instance;
    }

    // Initialiser ou mettre à jour la configuration de style en fonction du LoggerConfig
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
                styleConfigOptions = {}; // Configurations par défaut
                break;
        }

        // Mise à jour de la configuration de style
        this.loggerStylesConfig.updateConfig(styleConfigOptions);
    }

    // Méthode pour accéder à la configuration de style actuelle
    public getLoggerStylesConfig(): LoggerStylesConfig {
        return this.loggerStylesConfig;
    }
}
