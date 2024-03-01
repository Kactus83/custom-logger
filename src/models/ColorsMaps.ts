import { TerminalDarkColors, TerminalLightColors } from "../types/TerminalColors";
import { ColorChoice } from "../types/TerminalColors";

export const DarkColorMapping: { [key in ColorChoice]: string } = {
    Black: TerminalDarkColors.Black,
    Red: TerminalDarkColors.Red,
    Green: TerminalDarkColors.Green,
    Yellow: TerminalDarkColors.Yellow,
    Blue: TerminalDarkColors.Blue,
    Magenta: TerminalDarkColors.Magenta,
    Cyan: TerminalDarkColors.Cyan,
    White: TerminalDarkColors.White,
    Random: TerminalDarkColors.Black // Par défaut
};

export const LightColorMapping: { [key in ColorChoice]: string } = {
    Black: TerminalLightColors.Black,
    Red: TerminalLightColors.Red,
    Green: TerminalLightColors.Green,
    Yellow: TerminalLightColors.Yellow,
    Blue: TerminalLightColors.Blue,
    Magenta: TerminalLightColors.Magenta,
    Cyan: TerminalLightColors.Cyan,
    White: TerminalLightColors.White,
    Random: TerminalLightColors.White // Par défaut
};