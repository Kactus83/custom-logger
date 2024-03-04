import { LoggerClient } from "./LoggerClient";
import { SubProcessMetadata } from "../../types/ServiceMetadata";
import { LoggingService } from "../LoggingService";

export class SubProcessLoggerClient extends LoggerClient {
    private parentProcessId?: string;

    constructor(serviceName: string, parentProcess: LoggerClient) {
        super(serviceName);
        this.parentProcessId = parentProcess.processId;
        this.processId = this.register();
    }

    protected register(): string {
        if(!this.parentProcessId) {
            throw new Error("Parent process ID is not set. Please init the client before logging messages.");
        }
        const metadata = new SubProcessMetadata(this.serviceName, this.parentProcessId);
        // Enregistrement du sous-processus avec référence à l'ID du parent
        // et récupération de l'ID attribué au sous-processus
        return LoggingService.getInstance().registerService(metadata);
    }
}
