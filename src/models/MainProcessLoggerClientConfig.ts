import { LogLevel } from "../types/LogLevel";
import { LoggerMode } from "../types/LoggerMode";

export class MainProcessLoggerConfig {
    constructor(
        public serviceName: string,
        public loggerMode: LoggerMode,
        public logLevel: LogLevel,
        public showHierarchy: boolean,
        public showTimestamp: boolean
    ) {}
}