import { ColorChoice } from "./TerminalColors";

/**
 * Interface for the service metadata
 */
export interface IServiceMetadata {
  serviceName: string;
  color?: ColorChoice;
}

/**
 * Interface for the main process metadata
 */
export class MainProcessMetadata implements IServiceMetadata {
  serviceName: string;
  color?: ColorChoice;

  constructor(serviceName: string, color?: ColorChoice) {
    this.serviceName = serviceName;
    this.color = color;
  }
}

/**
 * Interface for the sub process metadata
 */
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
