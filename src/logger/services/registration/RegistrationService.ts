import { IServiceMetadata, MainProcessMetadata, SubProcessMetadata } from "../../../types/ServiceMetadata";

export class RegistrationService {
    private static instance: RegistrationService | null = null;
    // Stockage des métadonnées des services sous forme d'arbre pour une recherche rapide
    private servicesHierarchy: Map<string, MainProcessMetadata | SubProcessMetadata> = new Map();
    // Relation entre main processes et leurs subprocesses
    private mainToSubProcesses: Map<string, Array<SubProcessMetadata>> = new Map();
  
    private constructor() {}
  
    public static getInstance(): RegistrationService {
      if (!RegistrationService.instance) {
        RegistrationService.instance = new RegistrationService();
      }
      return RegistrationService.instance;
    }
    
    public registerService(metadata: MainProcessMetadata | SubProcessMetadata): string {
      let serviceName = metadata.serviceName;
      let counter = 1;

      // Vérifie si le nom est déjà pris et génère un nouveau nom si nécessaire
      while (this.servicesHierarchy.has(serviceName)) {
          serviceName = `${metadata.serviceName}_${counter++}`;
      }

      // Mise à jour du nom dans les métadonnées en cas de changement
      metadata.serviceName = serviceName;

      // Enregistrement du service avec le nouveau nom
      if (metadata instanceof MainProcessMetadata) {
          this.registerMainProcess(metadata);
      } else {
          this.registerSubProcess(metadata as SubProcessMetadata);
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
  
    // Méthode pour obtenir les subprocesses d'un main process
    public getSubProcessesOfMainProcess(mainProcessName: string): Array<SubProcessMetadata> | undefined {
      return this.mainToSubProcesses.get(mainProcessName);
    }
  }
  