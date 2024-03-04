import { ProcessDatabase } from "@models/process/ProcessDatabase";
import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ProcessesColorsService } from "../styles/ProcessesColorsService";

export class RegistrationService {
    private processDatabase: ProcessDatabase;
    private processesColorsService: ProcessesColorsService;

    constructor(processDatabase: ProcessDatabase, processesColorsService: ProcessesColorsService) {
        this.processDatabase = processDatabase;
        this.processesColorsService = processesColorsService;
    }

    public registerService(metadata: IServiceMetadata): string {

        // Configuration de la couleur et autres propriétés spécifiques avant l'enregistrement
        const updatedMetadata = this.processesColorsService.setColorForProcess(metadata);

        // Enregistrement du processus dans la base de données
        if (updatedMetadata instanceof MainProcessMetadata) {
            const id = this.processDatabase.addMainProcess(updatedMetadata);
            return id;
        } else if (updatedMetadata instanceof SubProcessMetadata && updatedMetadata.mainProcessName) {
            const id = this.processDatabase.addSubProcess(updatedMetadata.mainProcessName, updatedMetadata);
            return id;
        } else {
            throw new Error(`Invalid process metadata or parent name.`);
        }
    }
}
