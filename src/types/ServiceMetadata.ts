import { ColorChoice } from "./TerminalColors";

// Interface de base pour les métadonnées des services
export interface IServiceMetadata {
  serviceName: string;
  color?: ColorChoice;
}

// Classe pour les métadonnées des main processes
export class MainProcessMetadata implements IServiceMetadata {
  serviceName: string;
  color?: ColorChoice;

  constructor(serviceName: string, color?: ColorChoice) {
    this.serviceName = serviceName;
    this.color = color;
  }
}

// Classe pour les métadonnées des subprocesses
export class SubProcessMetadata implements IServiceMetadata {
  serviceName: string;
  mainProcessId: string;
  color?: ColorChoice;

  constructor(serviceName: string, mainProcessId: string, color?: ColorChoice) {
    this.serviceName = serviceName;
    this.mainProcessId = mainProcessId;
    this.color = color;
  }
}
