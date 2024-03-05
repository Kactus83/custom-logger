import { LoggerConfig } from "../../../models/LoggerConfig";
import { LoggerStylesConfig, LoggerStylesConfigOptions } from "../../../models/LoggerStylesConfig";
import { classicOptions, coloredOptions, dockerOptions } from "../../../models/LoggerStylesConfigLib";
import { LoggerMode } from "../../../types/LoggerMode";


/**
 * Gère la configuration des styles de journalisation pour l'application.
 * Utilise le motif Singleton pour s'assurer qu'une seule instance de cette classe est créée.
 */
export class StyleConfigManager {
    private static instance: StyleConfigManager;
    private loggerStylesConfig: LoggerStylesConfig;

    /**
     * Constructeur privé pour empêcher l'instanciation directe et forcer l'utilisation de getInstance().
     */
    private constructor() {
        this.loggerStylesConfig = new LoggerStylesConfig();
    }

    /**
     * Obtient l'instance unique de StyleConfigManager.
     * @returns {StyleConfigManager} L'instance singleton de StyleConfigManager.
     */
    public static getInstance(): StyleConfigManager {
        if (!this.instance) {
            this.instance = new StyleConfigManager();
        }
        return this.instance;
    }

    /**
     * Met à jour la configuration des styles en fonction du mode de journalisation spécifié.
     * @param {LoggerConfig} loggerConfig - La configuration du logger incluant le mode de journalisation.
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
     * Renvoie la configuration actuelle des styles de journalisation.
     * @returns {LoggerStylesConfig} La configuration actuelle des styles.
     */
    public getLoggerStylesConfig(): LoggerStylesConfig {
        return this.loggerStylesConfig;
    }
}
