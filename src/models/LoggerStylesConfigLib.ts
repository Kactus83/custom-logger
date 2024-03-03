import { LoggerElementConfig, LoggerElementStyles, LoggerStylesConfigOptions } from "./LoggerStylesConfig";
import { TerminalStyles } from "../types/TerminalStyles";
import { DarkColorMapping, LightColorMapping } from "./ColorsMaps"; 
import { ColorChoice } from "../types/TerminalColors";

// Définition initiale de styles par défaut pour réutilisation
const defaultStyles: LoggerElementStyles = {
    default: [TerminalStyles.None]
};
const defaultStyles_Tag: LoggerElementStyles = {
    default: [TerminalStyles.Bright]
};
const defaultStyles_Timestamps: LoggerElementStyles = {
    default: [TerminalStyles.Dim],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.Blink]
};

// Construction de la configuration pour le mode CLASSIC
export const classicOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(defaultStyles_Tag, defaultStyles_Tag),
    serviceName: new LoggerElementConfig(defaultStyles_Tag, defaultStyles_Tag),
    message: new LoggerElementConfig(defaultStyles, defaultStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.White
};

// Construction de la configuration pour le mode COLORED
const coloredStyles: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.None]
};
const coloredStyles_Tags: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.Bright],
    error: [TerminalStyles.Bright]
};

export const coloredOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(coloredStyles_Tags, coloredStyles_Tags),
    serviceName: new LoggerElementConfig(coloredStyles_Tags, coloredStyles_Tags),
    message: new LoggerElementConfig(coloredStyles, coloredStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.Cyan,
    subProcessColor: ColorChoice.Blue
};

// Construction de la configuration pour le mode DOCKER
const dockerStyles: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.None]
};
const dockerStyles_Tags: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.Bright],
    error: [TerminalStyles.Bright]
};
export const dockerOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(dockerStyles_Tags, dockerStyles_Tags),
    serviceName: new LoggerElementConfig(dockerStyles_Tags, dockerStyles_Tags),
    message: new LoggerElementConfig(dockerStyles, dockerStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.Random,
    subProcessColor: ColorChoice.Random
};
