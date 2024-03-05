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
            this.displayProcessNode(tree.root, 0, tree.root ? [...tree.root.children.keys()] : []);
            console.log(''); // Espacement pour la lisibilité
        });
    }

    /**
     * Recursively displays a process node and its children, indenting to illustrate hierarchy.
     * Uses visual cues to illustrate the tree structure.
     * @param {ProcessNode | null} node - The current process node to display.
     * @param {number} level - The current level of depth in the tree.
     * @param {string[]} siblingKeys - IDs of the sibling nodes to help visualize tree branches.
     */
    private displayProcessNode(node: ProcessNode | null, level: number, siblingKeys: string[]): void {
        if (!node) return;

        const isLastChild = (index: number) => index === siblingKeys.length - 1;

        node.children.forEach((child, childId, map) => {
            const isLast = isLastChild([...map.keys()].indexOf(childId));
            const prefix = ' '.repeat(level * 4) + (isLast ? '└── ' : '├── ');
            console.log(`${prefix}${child.metadata.serviceName} (ID: ${child.id})`);

            if (!isLast) {
                this.displayProcessNode(child, level + 1, [...map.keys()].slice([...map.keys()].indexOf(childId) + 1));
            } else {
                this.displayProcessNode(child, level + 1, []);
            }
        });
    }
}
