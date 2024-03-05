import { ProcessDatabase } from "@models/process/ProcessDatabase";
import { ProcessNode } from "@models/process/ProcessNode";

export class ProcessTreeVisualizationService {
    private processDatabase: ProcessDatabase;

    constructor(processDatabase: ProcessDatabase) {
        this.processDatabase = processDatabase;
    }

    /**
     * Displays all process trees within the database, illustrating their hierarchical structure.
     */
    public displayProcessTrees(): void {
        const trees = this.processDatabase.getTrees();
        trees.forEach((tree, processId) => {
            console.log(`Tree for Main Process ID: ${processId}`);
            this.displayProcessNode(tree.root, 0);
            console.log(''); // Espacement pour la lisibilité
        });
    }

    /**
     * Recursively displays a process node and its children, indenting to illustrate hierarchy.
     * @param {ProcessNode | null} node - The current process node to display.
     * @param {number} level - The current level of depth in the tree.
     */
    private displayProcessNode(node: ProcessNode | null, level: number): void {
        if (!node) return;

        const indent = ' '.repeat(level * 4); // 4 espaces d'indentation par niveau
        console.log(`${indent}${node.metadata.serviceName} (ID: ${node.id})`);

        node.children.forEach(child => {
            this.displayProcessNode(child, level + 1);
        });
    }
}
