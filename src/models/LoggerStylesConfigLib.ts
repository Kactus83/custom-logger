import { LoggerElementConfig, LoggerElementStyles, LoggerStylesConfigOptions } from "./LoggerStylesConfig";
import { TerminalStyles } from "../types/TerminalStyles";
import { DarkColorMapping, LightColorMapping } from "./ColorsMaps"; 
import { ColorChoice } from "../types/TerminalColors";


/**
 * Configuration for the Classic mode Logger Styles
 */

// Styles for the différents levels of classic log elements
const defaultStyles: LoggerElementStyles = {
    default: [TerminalStyles.None]
};

// Styles for the différents levels of tag logs elements
const defaultStyles_Tag: LoggerElementStyles = {
    default: [TerminalStyles.Bright]
};

// Styles for the différents levels of timestamps elements
const defaultStyles_Timestamps: LoggerElementStyles = {
    default: [TerminalStyles.Dim],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.Blink]
};

// Complete style configuration for classic mode
export const classicOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(defaultStyles_Tag, defaultStyles_Tag),
    serviceName: new LoggerElementConfig(defaultStyles_Tag, defaultStyles_Tag),
    message: new LoggerElementConfig(defaultStyles, defaultStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.White
};

/**
 * Configuration for the Colored mode Logger Styles
 */

// Styles for the différents levels of classic log elements
const coloredStyles: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.None]
};

// Styles for the différents levels of tag logs elements
const coloredStyles_Tags: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.Bright],
    error: [TerminalStyles.Bright]
};

// Complete style configuration for colored mode
export const coloredOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(coloredStyles_Tags, coloredStyles_Tags),
    serviceName: new LoggerElementConfig(coloredStyles_Tags, coloredStyles_Tags),
    message: new LoggerElementConfig(coloredStyles, coloredStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.Cyan,
    subProcessColor: ColorChoice.Blue
};

/**
 * Configuration for the Docker mode Logger Styles
 */

// Styles for the différents levels of classic log elements
const dockerStyles: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.None],
    error: [TerminalStyles.None]
};

// Styles for the differents levels of tag logs elements
const dockerStyles_Tags: LoggerElementStyles = {
    default: [TerminalStyles.None],
    trace: [TerminalStyles.Dim],
    debug: [TerminalStyles.Dim],
    info: [TerminalStyles.None],
    warn: [TerminalStyles.Bright],
    error: [TerminalStyles.Bright]
};

// Complete style configuration for the Docker mode
export const dockerOptions: LoggerStylesConfigOptions = {
    timestamp: new LoggerElementConfig(defaultStyles_Timestamps, defaultStyles_Timestamps),
    logLevel: new LoggerElementConfig(dockerStyles_Tags, dockerStyles_Tags),
    serviceName: new LoggerElementConfig(dockerStyles_Tags, dockerStyles_Tags),
    message: new LoggerElementConfig(dockerStyles, dockerStyles),
    colorMapping: DarkColorMapping,
    mainProcessColor: ColorChoice.White,
    subProcessColor: ColorChoice.White
};
