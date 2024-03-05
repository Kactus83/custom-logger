/**
 * Provides static methods to format log messages before they are output to the console.
 * It supports formatting of various data types including objects, arrays, and primitives into a readable string format.
 */
export class MessageFormatterService {

    /**
     * Formats a series of messages into a single string.
     * @param {...any[]} messages - An array of messages of various types.
     * @returns {string} A single formatted string combining all input messages.
     */
    public static formatMessages(...messages: any[]): string {
        // Aplatit le tableau de messages si nécessaire pour éviter les tableaux de tableaux
        const flatMessages = [].concat(...messages);

        // Traite chaque message individuellement et les joint avec un espace
        const formattedMessages = flatMessages.map(message => {
            const formattedMessage = MessageFormatterService.formatSingleMessage(message);
            return formattedMessage;
        }).join(' ');

        return formattedMessages.trim();
    }

    /**
     * Formats a single message based on its type.
     * @param {any} message - The message to format.
     * @returns {string} The formatted message.
     */
    private static formatSingleMessage(message: any): string {

        if (typeof message === 'object' && message !== null) {
            // Traite les objets et les tableaux différemment
            if (Array.isArray(message)) {
                // Appelle récursivement formatSingleMessage pour chaque élément du tableau
                return message.map(MessageFormatterService.formatSingleMessage).join(', ');
            } else {
                // Formate l'objet en chaîne JSON et retire les guillemets des clés
                let jsonString = JSON.stringify(message, null, 2).replace(/"([^"]+)":/g, '$1:');
                return jsonString;
            }
        } else if (typeof message === 'string') {
            // Retourne directement les chaînes sans guillemets supplémentaires
            return message;
        } else {
            // Convertit les autres types en chaînes directement
            return String(message);
        }
    }
}
