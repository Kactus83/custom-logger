import { LoggerClient } from "./LoggerClient";
import { SubProcessMetadata } from "../../types/ServiceMetadata";
import { LoggingService } from "../LoggingService";

/**
 * Extends LoggerClient to provide logging functionality specifically for sub-processes.
 */
export class SubProcessLoggerClient extends LoggerClient {
    private parentProcessId?: string;

    /**
     * Constructs a SubProcessLoggerClient with a service name and a reference to its parent process.
     * @param {string} serviceName - The name of the sub-process service.
     * @param {LoggerClient} parentProcess - The parent process logger client.
     */
    constructor(serviceName: string, parentProcess: LoggerClient) {
        super(serviceName);
        this.parentProcessId = parentProcess.processId;
        this.processId = this.register();
    }

    /**
     * Registers the sub-process with its parent process ID and retrieves its own process ID.
     * @protected
     * @returns {string} The process ID of the sub-process.
     */
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
