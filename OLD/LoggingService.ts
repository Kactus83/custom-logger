import { LogLevel } from "../../../types/LogLevel";
// Config générale pour les styles du logger
const logStylesConfig = {
    timestamp: {
        MainProcess: {
            ALL: ['dim'],
        },
        Default: {
            ALL: ['dim'],
        }
    },
    logLevel: {
        MainProcess: {
            TRACE: ['dim'],
            DEBUG: ['dim'],
            INFO: ['normal'],
            WARN: ['bold'],
            ERROR: ['bold'],
        },
        Default: {
            TRACE: ['dim'],
            DEBUG: ['normal'],
            INFO: ['normal'],
            WARN: ['normal'],
            ERROR: ['bold'],
        }
    },
    serviceName: {
        MainProcess: {
            ALL: ['bold'],
        },
        Default: {
            ALL: ['normal'],
        }
    },
    message: {
        MainProcess: {
            TRACE: ['dim'],
            DEBUG: ['normal'],
            INFO: ['normal'],
            WARN: ['normal'],
            ERROR: ['bold'],
        },
        Default: {
            TRACE: ['dim'],
            DEBUG: ['normal'],
            INFO: ['normal'],
            WARN: ['normal'],
            ERROR: ['bold'],
        }
    }
};

const Colors = {
    primary: '\x1b[33m', 
    reset: '\x1b[0m',
};

const Styles = {
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    blink: '\x1b[5m',
};

const LogLevelValues = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
};

function getStyles(config, context, level) {
    const defaultStyle = config['Default']['ALL'] || [];
    const contextStyles = config[context] && (config[context][level] || config[context]['ALL']) || defaultStyle;
    // S'assure que le résultat est toujours interprété comme un tableau
    return Array.isArray(contextStyles) ? contextStyles : [contextStyles];
}

export class LoggingService {
    private static instance: LoggingService;
    private currentLogLevel: LogLevel = LogLevel.INFO;

    private constructor() {}

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    public setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }

    private shouldLog(messageLevel: LogLevel): boolean {
        // Convertit les clés d'enum en valeurs numériques pour la comparaison
        const messageLevelIndex = Object.values(LogLevel).indexOf(messageLevel);
        const currentLevelIndex = Object.values(LogLevel).indexOf(this.currentLogLevel);
        return true;
        return messageLevelIndex >= currentLevelIndex;
    }    

    private applyStyle(styles, text) {
        // Applique les styles et la couleur primaire
        const styleCodes = styles.map(style => Styles[style] || '').join('');
        return `${Colors.primary}${styleCodes}${text}${Colors.reset}`;
    }


    private formatTimestamp(isError: boolean, isMainProcess: boolean): string {
        const now = new Date();
        const timestampStyle = getStyles(logStylesConfig.timestamp, isMainProcess ? 'MainProcess' : 'Default', 'ALL');
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        return this.applyStyle(timestampStyle, timestamp);
    }

    private formatLogLevel(level: LogLevel, isMainProcess: boolean): string {
        const levelStyle = getStyles(logStylesConfig.logLevel, isMainProcess ? 'MainProcess' : 'Default', level);
        return this.applyStyle(levelStyle, `[${level}]`);
    }

    private formatServiceName(serviceName: string, level: LogLevel, isMainProcess: boolean): string {
        const serviceNameStyle = getStyles(logStylesConfig.serviceName, isMainProcess ? 'MainProcess' : 'Default', 'ALL');
        return this.applyStyle(serviceNameStyle, `[${serviceName}]`);
    }

    private formatMessage(message: string, level: LogLevel, isMainProcess: boolean): string {
        const messageStyle = getStyles(logStylesConfig.message, isMainProcess ? 'MainProcess' : 'Default', level);
        return this.applyStyle(messageStyle, message);
    }

    public log(level: LogLevel, message: string, serviceName: string = "MainProcess"): void {
        if (!this.shouldLog(level)) return;

        const isMainProcess = serviceName === "MainProcess";
        const isError = level === LogLevel.ERROR;

        // Intégration des styles et couleurs pour chaque partie du log
        const timestamp = this.formatTimestamp(isError, isMainProcess);
        const logLevel = this.formatLogLevel(level, isMainProcess);
        const service = this.formatServiceName(serviceName, level, isMainProcess);
        const formattedMessage = this.formatMessage(message, level, isMainProcess);

        console.log(`${timestamp} ${logLevel} ${service} - ${formattedMessage}`);
    }
}
