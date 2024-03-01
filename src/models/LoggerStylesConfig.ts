import { LogLevel } from "../types/LogLevel";
import { ColorChoice } from "../types/TerminalColors";
import { TerminalStyles } from "../types/TerminalStyles";
import { DarkColorMapping } from "./ColorsMaps";

// Définition des structures pour les styles
export interface LoggerElementStyles {
    default: TerminalStyles[];
    trace?: TerminalStyles[];
    debug?: TerminalStyles[];
    info?: TerminalStyles[];
    warn?: TerminalStyles[];
    error?: TerminalStyles[];
}

export class LoggerElementConfig {
    MainProcess: LoggerElementStyles;
    SubProcess: LoggerElementStyles;

    constructor(mainProcess: LoggerElementStyles, subProcess: LoggerElementStyles) {
        this.MainProcess = mainProcess;
        this.SubProcess = subProcess;
    }

    getStyles(isMainProcess: boolean, level: LogLevel): TerminalStyles[] {
        const processStyles = isMainProcess ? this.MainProcess : this.SubProcess;
        return this.resolveStyles(processStyles, level);
    }

    private resolveStyles(styles: LoggerElementStyles, level: LogLevel): TerminalStyles[] {
        switch (level) {
            case LogLevel.TRACE: return styles.trace || styles.default;
            case LogLevel.DEBUG: return styles.debug || styles.default;
            case LogLevel.INFO: return styles.info || styles.default;
            case LogLevel.WARN: return styles.warn || styles.default;
            case LogLevel.ERROR: return styles.error || styles.default;
            default: return styles.default;
        }
    }
}

export class LoggerStylesConfig {
    timestamp: LoggerElementConfig;
    logLevel: LoggerElementConfig;
    serviceName: LoggerElementConfig;
    message: LoggerElementConfig;
    mainProcessColor: ColorChoice = ColorChoice.White;
    subProcessColor: ColorChoice = ColorChoice.White;
    colorMapping: { [key in ColorChoice]: string } = DarkColorMapping;

    constructor() {
        // Initialisation avec des styles par défaut pour chaque élément de log
        let defaultElementStyles: LoggerElementStyles = { default: [TerminalStyles.Reset] };
        this.timestamp = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.logLevel = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.serviceName = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
        this.message = new LoggerElementConfig(defaultElementStyles, defaultElementStyles);
    }

    // Méthode pour fusionner la configuration actuelle avec une nouvelle
    updateConfig(newConfig: LoggerStylesConfigOptions): void {
        if (newConfig.timestamp) {
            this.timestamp = new LoggerElementConfig(newConfig.timestamp.MainProcess, newConfig.timestamp.SubProcess);
        }
        if (newConfig.logLevel) {
            this.logLevel = new LoggerElementConfig(newConfig.logLevel.MainProcess, newConfig.logLevel.SubProcess);
        }
        if (newConfig.serviceName) {
            this.serviceName = new LoggerElementConfig(newConfig.serviceName.MainProcess, newConfig.serviceName.SubProcess);
        }
        if (newConfig.message) {
            this.message = new LoggerElementConfig(newConfig.message.MainProcess, newConfig.message.SubProcess);
        }
        if (newConfig.mainProcessColor) {
            this.mainProcessColor = newConfig.mainProcessColor;
        }
        if (newConfig.subProcessColor) {
            this.subProcessColor = newConfig.subProcessColor;
        }
        if (newConfig.colorMapping) {
            this.colorMapping = newConfig.colorMapping; 
        }
    }
}

// Utilisation de l'interface pour les options de configuration externe
export interface LoggerStylesConfigOptions {
    timestamp?: LoggerElementConfig;
    logLevel?: LoggerElementConfig;
    serviceName?: LoggerElementConfig;
    message?: LoggerElementConfig;
    mainProcessColor?: ColorChoice;
    subProcessColor?: ColorChoice;
    colorMapping?: { [key in ColorChoice]: string }; 
}

