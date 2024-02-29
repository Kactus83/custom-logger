import { ColorChoice, TerminalColors } from "../types/TerminalColors";
import { TerminalStyles } from "../types/TerminalStyles";
import { LogLevel } from "../types/LogLevel";

interface StyleConfig {
    [key: string]: TerminalStyles[] | undefined;
}

class LoggerElementStyle {
    MainProcess: StyleConfig;
    SubProcess: StyleConfig;

    constructor(mainProcess: StyleConfig, subProcess: StyleConfig) {
        this.MainProcess = mainProcess;
        this.SubProcess = subProcess;
    }

    getStyle(isMainProcess: boolean, level: LogLevel | 'DEFAULT' = 'DEFAULT'): TerminalStyles[] {
        const processType = isMainProcess ? this.MainProcess : this.SubProcess;
        return processType[level] || processType['DEFAULT'] || [];
    }
}
export interface LoggerElementConfig {
    MainProcess: StyleConfig;
    SubProcess: StyleConfig;
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
    timestamp: LoggerElementStyle;
    logLevel: LoggerElementStyle;
    serviceName: LoggerElementStyle;
    message: LoggerElementStyle;
    mainProcessColor: ColorChoice;
    subProcessColor: ColorChoice;

    constructor(options?: LoggerStylesConfigOptions) {
        this.timestamp = new LoggerElementStyle(
            { DEFAULT: [TerminalStyles.Dim] },
            { DEFAULT: [TerminalStyles.Dim] }
        );
        this.logLevel = new LoggerElementStyle(
            {
                TRACE: [TerminalStyles.Dim],
                DEBUG: [TerminalStyles.Dim],
                INFO: [TerminalStyles.Reset],
                WARN: [TerminalStyles.Bright],
                ERROR: [TerminalStyles.Bright],
                DEFAULT: [TerminalStyles.Reset],
            },
            {
                TRACE: [TerminalStyles.Dim],
                DEBUG: [TerminalStyles.Reset],
                INFO: [TerminalStyles.Reset],
                WARN: [TerminalStyles.Reset],
                ERROR: [TerminalStyles.Bright],
                DEFAULT: [TerminalStyles.Reset],
            }
        );
        this.serviceName = new LoggerElementStyle(
            { DEFAULT: [TerminalStyles.Bright] },
            { DEFAULT: [TerminalStyles.Reset] }
        );
        this.message = new LoggerElementStyle(
            {
                TRACE: [TerminalStyles.Dim],
                DEBUG: [TerminalStyles.Reset],
                INFO: [TerminalStyles.Reset],
                WARN: [TerminalStyles.Reset],
                ERROR: [TerminalStyles.Bright],
                DEFAULT: [TerminalStyles.Reset],
            },
            {
                TRACE: [TerminalStyles.Dim],
                DEBUG: [TerminalStyles.Reset],
                INFO: [TerminalStyles.Reset],
                WARN: [TerminalStyles.Reset],
                ERROR: [TerminalStyles.Bright],
                DEFAULT: [TerminalStyles.Reset],
            }
        );
        this.mainProcessColor = options?.mainProcessColor || ColorChoice.White;
        this.subProcessColor = options?.subProcessColor || ColorChoice.White;
    }
}
