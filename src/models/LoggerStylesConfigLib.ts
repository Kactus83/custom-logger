import { LoggerElementConfig, LoggerElementStyles, LoggerStylesConfigOptions } from "./LoggerStylesConfig";
import { TerminalStyles } from "../types/TerminalStyles";
import { DarkColorMapping, LightColorMapping } from "./ColorsMaps"; 

// Définition initiale de styles par défaut pour réutilisation
const defaultStyles: LoggerElementStyles = { default: [TerminalStyles.Reset] };

// Construction de la configuration pour le mode CLASSIC
export const classicOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles, defaultStyles),
    logLevel: new LoggerElementConfig(defaultStyles, defaultStyles),
    serviceName: new LoggerElementConfig(defaultStyles, defaultStyles),
    message: new LoggerElementConfig(defaultStyles, defaultStyles),
    colorMapping: DarkColorMapping
};

// Construction de la configuration pour le mode COLORED
const coloredStyles: LoggerElementStyles = {
    default: [TerminalStyles.Bright],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Reset],
    info: [TerminalStyles.Bright, TerminalStyles.Underscore],
    warn: [TerminalStyles.Blink],
    error: [TerminalStyles.Reverse]
};
export const coloredOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(coloredStyles, coloredStyles),
    logLevel: new LoggerElementConfig(coloredStyles, coloredStyles),
    serviceName: new LoggerElementConfig(coloredStyles, coloredStyles),
    message: new LoggerElementConfig(coloredStyles, coloredStyles),
    colorMapping: DarkColorMapping
};

// Construction de la configuration pour le mode DOCKER
const dockerStyles: LoggerElementStyles = {
    default: [TerminalStyles.Bright],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Reset],
    info: [TerminalStyles.Bright],
    warn: [TerminalStyles.Blink],
    error: [TerminalStyles.Reverse]
};
export const dockerOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(dockerStyles, dockerStyles),
    logLevel: new LoggerElementConfig(dockerStyles, dockerStyles),
    serviceName: new LoggerElementConfig(dockerStyles, dockerStyles),
    message: new LoggerElementConfig(dockerStyles, dockerStyles),
    colorMapping: DarkColorMapping
};
