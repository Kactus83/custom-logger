import { LogLevel } from "../types/LogLevel"; // Assurez-vous que le chemin est correct
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

class LoggerElementConfig {
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
            case LogLevel.TRACE:
                return styles.trace || styles.default;
            case LogLevel.DEBUG:
                return styles.debug || styles.default;
            case LogLevel.INFO:
                return styles.info || styles.default;
            case LogLevel.WARN:
                return styles.warn || styles.default;
            case LogLevel.ERROR:
                return styles.error || styles.default;
            default:
                return styles.default;
        }
    }
}

export interface LoggerStylesConfigOptions {
    timestamp?: LoggerElementConfig;
    logLevel?: LoggerElementConfig;
    serviceName?: LoggerElementConfig;
    message?: LoggerElementConfig;
    mainProcessColor?: ColorChoice;
    subProcessColor?: ColorChoice;
}

// Classe pour la configuration des styles
export class LoggerStylesConfig {
    timestamp: LoggerElementConfig;
    logLevel: LoggerElementConfig;
    serviceName: LoggerElementConfig;
    message: LoggerElementConfig;
    mainProcessColor: ColorChoice;
    subProcessColor: ColorChoice;
    colorMapping: { [key in ColorChoice]: string };

    constructor(options?: LoggerStylesConfigOptions) {
        this.timestamp = this.createLoggerElementConfig(options?.timestamp, { default: [TerminalStyles.Dim] });
        this.logLevel = this.createLoggerElementConfig(options?.logLevel, {
            default: [TerminalStyles.Reset],
            trace: [TerminalStyles.Dim],
            debug: [TerminalStyles.Dim],
            info: [TerminalStyles.Reset],
            warn: [TerminalStyles.Bright],
            error: [TerminalStyles.Bright]
        }, true);
        this.serviceName = this.createLoggerElementConfig(options?.serviceName, { default: [TerminalStyles.Bright] });
        this.message = this.createLoggerElementConfig(options?.message, { default: [TerminalStyles.Reset] });
        this.mainProcessColor = options?.mainProcessColor || ColorChoice.White;
        this.subProcessColor = options?.subProcessColor || ColorChoice.White;
        this.colorMapping = DarkColorMapping;
    }

    private createLoggerElementConfig(configOption: LoggerElementConfig | undefined, defaultStyles: LoggerElementStyles, includeLogLevelStyles: boolean = false): LoggerElementConfig {
        let mainProcessStyles = { ...defaultStyles };
        let subProcessStyles = { ...defaultStyles };

        if (configOption) {
            mainProcessStyles = { ...mainProcessStyles, ...configOption.MainProcess };
            subProcessStyles = { ...subProcessStyles, ...configOption.SubProcess };
        }

        return new LoggerElementConfig(mainProcessStyles, subProcessStyles);
    }
}
