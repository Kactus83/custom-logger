import { ProcessDatabase } from "@models/process/ProcessDatabase";
import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ProcessesColorsService } from "../styles/ProcessesColorsService";

/**
 * Manages the registration of services and processes in the process database.
 */
export class RegistrationService {
    private processDatabase: ProcessDatabase;
    private processesColorsService: ProcessesColorsService;

    /**
     * Constructor of RegistrationService.
     * @param {ProcessDatabase} processDatabase - Process database for registration.
     * @param {ProcessesColorsService} processesColorsService - Service for assigning colors to processes.
     */
    constructor(processDatabase: ProcessDatabase, processesColorsService: ProcessesColorsService) {
        this.processDatabase = processDatabase;
        this.processesColorsService = processesColorsService;
    }

    /**
     * Registers a service or subprocess and assigns it an ID.
     * @param {IServiceMetadata} metadata - Metadata of the service or subprocess.
     * @returns {string} ID assigned to the registered service or subprocess.
     */
    public registerService(metadata: IServiceMetadata): string {

        let updatedMetadata: IServiceMetadata;

        if(metadata instanceof SubProcessMetadata && metadata.mainProcessId) {
            // Retrieve parent metadata if specified
            const parentMetadata = metadata.mainProcessId ? this.processDatabase.findProcessById(metadata.mainProcessId)?.metadata : undefined;
            // Update the process color taking into account the parent metadata if present
            updatedMetadata = this.processesColorsService.setColorForProcess(metadata, parentMetadata);
        }else{
            // Update the process color without parent metadata
            updatedMetadata = this.processesColorsService.setColorForProcess(metadata);    
        }

        // Register the process in the database and return the assigned ID
        let id: string;
        if (updatedMetadata instanceof MainProcessMetadata) {
            id = this.processDatabase.addMainProcess(updatedMetadata);
        } else if (updatedMetadata instanceof SubProcessMetadata) {
            if (!updatedMetadata.mainProcessId) {
                throw new Error("Parent process ID must be provided for sub-processes.");
            }
            id = this.processDatabase.addSubProcess(updatedMetadata.mainProcessId, updatedMetadata);
        } else {
            throw new Error("Invalid process metadata.");
        }

        return id;
    }
}
