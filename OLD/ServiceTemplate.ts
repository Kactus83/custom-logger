import { SubServiceConfig } from "../../../models/config/SubServiceConfig";
import { LogLevel } from "../../../types/LogLevel";
import { LoggingService } from "./LoggingService";

export abstract class ServiceTemplate {
    protected logger = LoggingService.getInstance();
    protected subServiceName?: string;

    constructor(subServiceConfig: SubServiceConfig) {
        this.subServiceName = subServiceConfig.subServiceName;
    }

    protected log(level: LogLevel, message: string): void {
        this.logger.log(level, message, this.subServiceName);
    }
}
