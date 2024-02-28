import { ColorChoice } from "../types/TerminalColors";
import { TerminalStyles } from "../types/TerminalStyles";

interface LogLevelConfig {
    NONE?: TerminalStyles[];
    TRACE?: TerminalStyles[];
    DEBUG?: TerminalStyles[];
    INFO?: TerminalStyles[];
    WARN?: TerminalStyles[];
    ERROR?: TerminalStyles[];
    DEFAULT?: TerminalStyles[];
}

interface LoggerElementConfig {
    MainProcess: LogLevelConfig;
    SubProcess: LogLevelConfig;
}

interface LoggerStylesConfigOptions {
    timestamp?: LoggerElementConfig;
    logLevel?: LoggerElementConfig;
    serviceName?: LoggerElementConfig;
    message?: LoggerElementConfig;
    mainProcessColor?: ColorChoice;
    subProcessColor?: ColorChoice;
}

export class LoggerStylesConfig {
    timestamp: LoggerElementConfig = {
        MainProcess: { DEFAULT: [TerminalStyles.Dim] },
        SubProcess: { DEFAULT: [TerminalStyles.Dim] },
    };
    logLevel: LoggerElementConfig = {
        MainProcess: {
            TRACE: [TerminalStyles.Dim],
            DEBUG: [TerminalStyles.Dim],
            INFO: [TerminalStyles.Reset],
            WARN: [TerminalStyles.Bright],
            ERROR: [TerminalStyles.Bright],
            DEFAULT: [TerminalStyles.Reset],
        },
        SubProcess: {
            TRACE: [TerminalStyles.Dim],
            DEBUG: [TerminalStyles.Reset],
            INFO: [TerminalStyles.Reset],
            WARN: [TerminalStyles.Reset],
            ERROR: [TerminalStyles.Bright],
            DEFAULT: [TerminalStyles.Reset],
        },
    };
    serviceName: LoggerElementConfig = {
        MainProcess: { DEFAULT: [TerminalStyles.Bright] },
        SubProcess: { DEFAULT: [TerminalStyles.Reset] },
    };
    message: LoggerElementConfig = {
        MainProcess: {
            TRACE: [TerminalStyles.Dim],
            DEBUG: [TerminalStyles.Reset],
            INFO: [TerminalStyles.Reset],
            WARN: [TerminalStyles.Reset],
            ERROR: [TerminalStyles.Bright],
            DEFAULT: [TerminalStyles.Reset],
        },
        SubProcess: {
            TRACE: [TerminalStyles.Dim],
            DEBUG: [TerminalStyles.Reset],
            INFO: [TerminalStyles.Reset],
            WARN: [TerminalStyles.Reset],
            ERROR: [TerminalStyles.Bright],
            DEFAULT: [TerminalStyles.Reset],
        },
    };
    mainProcessColor: ColorChoice = ColorChoice.White;
    subProcessColor: ColorChoice = ColorChoice.White;

    constructor(options?: LoggerStylesConfigOptions) {
        if (options) {
            Object.keys(options).forEach(key => {
                const safeKey = key as keyof LoggerStylesConfigOptions;
                if (options[safeKey] !== undefined) {
                    (this as any)[safeKey] = options[safeKey];
                }
            });
        }
    }
}
