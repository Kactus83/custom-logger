/**
 * Configuration for the SubProcessLoggerClient
 */
export class SubProcessLoggerConfig {
    constructor(
        public serviceName: string,
        public mainProcessId: string
    ) {}
}