import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";

/**
 * An abstract base class for logger clients representing either main processes or sub-processes.
 */
export abstract class LoggerClient {
    public processId?: string;
    protected serviceName: string;

    /**
     * Initializes the logger client with a service name.
     * @param {string} serviceName - The name of the service or process.
     */
    constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    /**
     * Logs a message at a specified log level.
     * @param {LogLevel} level - The log level of the message.
     * @param {...(string | number | boolean | object)[]} messages - The messages to log.
     */
    public log(level: LogLevel, ...messages: (string | number | boolean | object)[]): void {
        if(!this.processId) {
            throw new Error("Process ID is not set. Please init the client before logging messages.");
        }
        LoggingService.getInstance().log(this.processId, level, messages);
    }
}
