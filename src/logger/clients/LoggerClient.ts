import { MainProcessMetadata, SubProcessMetadata } from "../../types/ServiceMetadata";
import { LogLevel } from "../../types/LogLevel";
import { LoggingService } from "../LoggingService";

export abstract class LoggerClient {
    protected serviceName: string;
    protected mainProcessName?: string;

    constructor(serviceName: string, mainProcessName?: string) {
        this.serviceName = serviceName;
        this.mainProcessName = mainProcessName;
        this.init();
        this.register();
    }

    protected abstract init(): void;
    protected abstract getServiceMetadata(): SubProcessMetadata | MainProcessMetadata;

    protected register(): void {
        const metadata = this.getServiceMetadata();
        this.serviceName = LoggingService.getInstance().registerService(metadata);
    }
    protected log(level: LogLevel, message: string): void {
        LoggingService.getInstance().log(this.serviceName, level, message);
    }
}
