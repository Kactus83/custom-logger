import { ColorChoice } from "./TerminalColors";

export interface ServiceMetadata {
    serviceName: string;
    isMainProcess: boolean;
    color?: ColorChoice;
}

export default ServiceMetadata;