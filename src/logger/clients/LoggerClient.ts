import { LoggingService } from "../LoggingService";
import { LogLevel } from "../../types/LogLevel";
import ServiceMetadata from "../../types/ServiceMetadata";

export abstract class LoggerClient {
    protected serviceMetadata: ServiceMetadata;

    constructor(serviceName: string, isMainProcess: boolean) {
        this.serviceMetadata = { serviceName, isMainProcess };
        if (!LoggingService.isInitialized() && !isMainProcess) {
            throw new Error("LoggingService must be initialized by a MainProcessLoggerClient before creating a SubProcessLoggerClient.");
        }
        LoggingService.getInstance().registerServiceIfNeeded(this.serviceMetadata);
    }

    protected log(level: LogLevel, message: string): void {
        LoggingService.getInstance().log(this.serviceMetadata, level, message);
    }
}
