import { LoggerClient } from "./LoggerClient";

export class SubProcessLoggerClient extends LoggerClient {
    constructor(serviceName: string) {
        super(serviceName, false);
    }

    // Pas besoin de surcharger ou d'ajouter des méthodes spécifiques ici,
    // sauf si vous avez des comportements spécifiques aux sous-processus.
}
