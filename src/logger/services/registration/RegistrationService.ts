import { ProcessDatabase } from "@models/process/ProcessDatabase";
import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { ProcessesColorsService } from "../styles/ProcessesColorsService";

/**
 * Gère l'enregistrement des services et processus dans la base de données des processus.
 */
export class RegistrationService {
    private processDatabase: ProcessDatabase;
    private processesColorsService: ProcessesColorsService;

    /**
     * Constructeur de RegistrationService.
     * @param {ProcessDatabase} processDatabase - Base de données des process pour l'enregistrement.
     * @param {ProcessesColorsService} processesColorsService - Service pour attribuer des couleurs aux processus.
     */
    constructor(processDatabase: ProcessDatabase, processesColorsService: ProcessesColorsService) {
        this.processDatabase = processDatabase;
        this.processesColorsService = processesColorsService;
    }

    /**
     * Enregistre un service ou un sous-processus et lui attribue un ID.
     * @param {IServiceMetadata} metadata - Métadonnées du service ou sous-processus.
     * @returns {string} ID attribué au service ou sous-processus enregistré.
     */
    public registerService(metadata: IServiceMetadata): string {

        let updatedMetadata: IServiceMetadata;

        if(metadata instanceof SubProcessMetadata && metadata.mainProcessId) {
            // Récupération des métadonnées du parent si spécifié
            const parentMetadata = metadata.mainProcessId ? this.processDatabase.findProcessById(metadata.mainProcessId)?.metadata : undefined;
            // Mise à jour de la couleur du processus en tenant compte des métadonnées du parent si présentes
            updatedMetadata = this.processesColorsService.setColorForProcess(metadata, parentMetadata);
        }else{
            // Mise à jour de la couleur du processus sans métadonnées du parent 
            updatedMetadata = this.processesColorsService.setColorForProcess(metadata);    
        }

        // Enregistrement du processus dans la base de données et retour de l'ID attribué
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
