import { SubProcessMetadata } from "../../types/ServiceMetadata";
import { LoggerClient } from "./LoggerClient";

export class SubProcessLoggerClient extends LoggerClient {

    constructor(serviceName: string, mainProcessName: string) {
        super(serviceName, mainProcessName);
    }

    protected init(): void {
        // Aucune initialisation spécifique requise pour les subprocesses
    }

    protected getServiceMetadata(): SubProcessMetadata {
        return new SubProcessMetadata(this.serviceName, this.mainProcessName!);
    }
}
