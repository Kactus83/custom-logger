import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";

export abstract class LoggerClient {
    public processId?: string;
    protected serviceName: string;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    public log(level: LogLevel, ...messages: any[]): void {
        if(!this.processId) {
            throw new Error("Process ID is not set. Please init the client before logging messages.");
        }
        // Utilisation du service de journalisation pour enregistrer le message
        // avec l'ID du processus pour identifier le service source
        LoggingService.getInstance().log(this.processId, level, messages);
    }
}
