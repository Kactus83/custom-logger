import { ProcessDatabase } from "../../../models/process/ProcessDatabase";
import { ProcessNode } from "../../../models/process/ProcessNode";
import { TerminalStyles } from "../../../types/TerminalStyles";

/**
 * Service for displaying process trees.
 */
export class ProcessTreeVisualizationService {
    private processDatabase: ProcessDatabase;

    /**
     * Constructs a new ProcessTreeVisualizationService instance.
     * @param processDatabase The process database to use.
     */
    constructor(processDatabase: ProcessDatabase) {
        this.processDatabase = processDatabase;
    }

    /**
     * Displays the process trees.
     */
    public displayProcessTrees(): void {
        const trees = this.processDatabase.getTrees();
        trees.forEach((tree, processId) => {
            if (!tree.root) {
                console.error(`Main process with ID ${processId} has no root.`);
                return;
            }
            console.log("=== Tree for Main Process ===\n");
            console.log(`${this.applyStyle(tree.root.metadata.serviceName, TerminalStyles.Bright)}`);
            this.displayProcessNode(tree.root, "    ");
        });
        console.log("");
    }

    /**
     * Displays a process node and its children recursively.
     * @param node The process node to display.
     * @param indent The indentation string.
     */
    private displayProcessNode(node: ProcessNode, indent: string): void {
        const children = Array.from(node.children.values());
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const connector = isLastChild ? "└─ " : "├─ ";
            const childStyle = indent.length > 4 ? TerminalStyles.Dim : TerminalStyles.None;
            console.log(`${indent}${connector}${this.applyStyle(child.metadata.serviceName, childStyle)}`);
            
            const newIndent = isLastChild ? indent + "        " : indent + "|       ";
            this.displayProcessNode(child, newIndent);
        });
    }

    /**
     * Applies a style to the given text.
     * @param text The text to apply the style to.
     * @param style The style to apply.
     * @returns The styled text.
     */
    private applyStyle(text: string, style: TerminalStyles): string {
        return `${style}${text}${TerminalStyles.Reset}`;
    }
}
