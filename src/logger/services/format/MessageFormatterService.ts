class MessageFormatterService {
    public static formatMessages(messages: any[]): string {
        return messages.map(message => {
            if (typeof message === 'object') {
                // Convertit l'objet en chaîne JSON formatée pour l'affichage
                return JSON.stringify(message, null, 2);
            }
            // Convertit le message en chaîne si ce n'est pas déjà le cas
            return String(message);
        }).join(' '); // Sépare les messages convertis par un espace
    }
}
