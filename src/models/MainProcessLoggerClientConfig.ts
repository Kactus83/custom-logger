import { LoggerDetailsLevel } from "../types/LoggerDetailsLevel";
import { LogLevel } from "../types/LogLevel";
import { LoggerMode } from "../types/LoggerMode";

/**
 * Main Process Logger Client Configuration
 */
export class MainProcessLoggerConfig {
    constructor(
        public serviceName: string,
        public loggerMode: LoggerMode,
        public detailsLevel: LoggerDetailsLevel,
        public logLevel: LogLevel,
        public showHierarchy: boolean,
        public showTimestamp: boolean
    ) {}
}