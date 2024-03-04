export class MessageFormatterService {
    public static formatMessages(...messages: any[]): string {
        return messages.map(MessageFormatterService.formatSingleMessage).join(' ');
    }

    private static formatSingleMessage(message: any): string {
        if (typeof message === 'object' && message !== null) {
            // Utilise JSON.stringify pour formater les objets, excluant les crochets pour les tableaux uniques
            const formattedObject = JSON.stringify(message, null, 2);
            // Supprime les guillemets des chaînes JSONifiées pour un affichage propre
            return formattedObject.startsWith('[') && formattedObject.endsWith(']')
                ? formattedObject.slice(1, -1)
                : formattedObject;
        }
        // Traite les chaînes de caractères et autres types sans modification supplémentaire
        return message;
    }
}
