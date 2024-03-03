import { LoggerMode } from "../../../types/LoggerMode";
import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";
import { LoggerStyleService } from "../styles/LoggerStyleService";

export class RegistrationService {
    private loggerStyleService: LoggerStyleService;
    loggerMode: LoggerMode;
    // Stockage des métadonnées des services sous forme d'arbre pour une recherche rapide
    private servicesHierarchy: Map<string, MainProcessMetadata | SubProcessMetadata> = new Map();
    // Relation entre main processes et leurs subprocesses
    private mainToSubProcesses: Map<string, Array<SubProcessMetadata>> = new Map();
  
    constructor(loggerStyleService: LoggerStyleService, loggerMode: LoggerMode) {
      this.loggerStyleService = loggerStyleService;
      this.loggerMode = loggerMode;
    }

    public updateLoggerMode(loggerMode: LoggerMode): void {
      this.loggerMode = loggerMode;
    };
    
    public registerService(metadata: IServiceMetadata): string {
      let serviceName = metadata.serviceName;
      let counter = 1;

      // Vérifie si le nom est déjà pris et génère un nouveau nom si nécessaire
      while (this.servicesHierarchy.has(serviceName)) {
          serviceName = `${metadata.serviceName}_${counter++}`;
      }

      // Mise à jour du nom dans les métadonnées en cas de changement
      metadata.serviceName = serviceName;

      let updatedMetadata: IServiceMetadata;
      if (metadata instanceof MainProcessMetadata) {
          updatedMetadata = this.loggerStyleService.setColorForProcess(metadata, this.loggerMode);
          this.registerMainProcess(updatedMetadata as MainProcessMetadata);
      } else {
          const mainProcessMetadata = this.findMainProcessMetadata((metadata as SubProcessMetadata).mainProcessName);
          updatedMetadata = this.loggerStyleService.setColorForProcess(metadata, this.loggerMode, mainProcessMetadata);
          this.registerSubProcess(updatedMetadata as SubProcessMetadata);
      }
      
      return serviceName;
  }
  
    private registerMainProcess(metadata: MainProcessMetadata): void {
      if (!this.servicesHierarchy.has(metadata.serviceName)) {
        this.servicesHierarchy.set(metadata.serviceName, metadata);
        // Assurer que chaque main process a une entrée dans la relation main-to-sub même s'il n'a pas de subprocesses
        this.mainToSubProcesses.set(metadata.serviceName, []);
      }
    }
  
    private registerSubProcess(metadata: SubProcessMetadata): void {
      if (!this.servicesHierarchy.has(metadata.serviceName)) {
        this.servicesHierarchy.set(metadata.serviceName, metadata);
        // Ajout du subprocess à la liste de son main process
        const subprocessesList = this.mainToSubProcesses.get(metadata.mainProcessName);
        if (subprocessesList) {
          subprocessesList.push(metadata);
        } else {
          // Si le main process n'est pas encore enregistré, cela indique une erreur potentielle dans l'ordre d'enregistrement
          console.error(`Main process ${metadata.mainProcessName} not found for subprocess ${metadata.serviceName}.`);
        }
      }
    }
  
    public findServiceMetadata(serviceName: string): IServiceMetadata | undefined {
      return this.servicesHierarchy.get(serviceName);
    }

    private findMainProcessMetadata(mainProcessName: string): MainProcessMetadata | undefined {
      const mainProcessMetadata = this.servicesHierarchy.get(mainProcessName);
      if (mainProcessMetadata instanceof MainProcessMetadata) {
          return mainProcessMetadata;
      }
      console.error(`Main process ${mainProcessName} not found.`);
      return undefined;
  }  
  
    // Méthode pour obtenir les subprocesses d'un main process
    public getSubProcessesOfMainProcess(mainProcessName: string): Array<SubProcessMetadata> | undefined {
      return this.mainToSubProcesses.get(mainProcessName);
    }
  
  }
  