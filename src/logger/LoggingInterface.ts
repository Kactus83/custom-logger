// Importations nécessaires
import { ColorChoice } from "../types/TerminalColors";
import { LogLevel } from "../types/LogLevel";
import ServiceMetadata from "../types/ServiceMetadata";
import { LoggingService } from "./LoggingService"; 

// Classe abstraite LoggingInterface
abstract class LoggingInterface {
    // Les métadonnées du service qui utilise cette interface
    private serviceMetadata: ServiceMetadata;

    constructor(serviceName: string, isMainProcess: boolean, color?: ColorChoice) {
        // Initialisation des métadonnées du service
        this.serviceMetadata = {
            serviceName,
            isMainProcess,
            color,
        };

        // Enregistrement du service auprès du LoggingService
        LoggingService.getInstance().registerService(this.serviceMetadata);
    }

    // Méthode pour loguer un message avec le niveau de log spécifié
    protected log(level: LogLevel, message: string): void {
        // Appel au LoggingService pour loguer le message avec les métadonnées du service
        LoggingService.getInstance().log(this.serviceMetadata, level, message);
    }
}

export default LoggingInterface;
