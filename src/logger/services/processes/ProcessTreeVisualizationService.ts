import { ProcessDatabase } from "../../../models/process/ProcessDatabase";
import { ProcessNode } from "../../../models/process/ProcessNode";
import { TerminalStyles } from "../../../types/TerminalStyles";

export class ProcessTreeVisualizationService {
    private processDatabase: ProcessDatabase;

    constructor(processDatabase: ProcessDatabase) {
        this.processDatabase = processDatabase;
    }

    public displayProcessTrees(): void {
        const trees = this.processDatabase.getTrees();
        trees.forEach((tree, processId) => {
            if (!tree.root) {
                console.error(`Main process with ID ${processId} has no root.`);
                return;
            }
            console.log("=== Tree for Main Process ===\n");
            // Main process name styled and printed
            console.log(`${this.applyStyle(tree.root.metadata.serviceName, TerminalStyles.Bright)}`);
            // Indentation starts after the main process name
            this.displayProcessNode(tree.root, "    ");
        });
        console.log(""); // Additional newline for readability
    }

    private displayProcessNode(node: ProcessNode, indent: string): void {
        const children = Array.from(node.children.values());
        children.forEach((child, index) => {
            // Determine if the current child is the last in its siblings
            const isLastChild = index === children.length - 1;
            // Choose connector based on sibling status
            const connector = isLastChild ? "└─ " : "├─ ";
            // Apply style based on depth
            const childStyle = indent.length > 4 ? TerminalStyles.Dim : TerminalStyles.None;
            console.log(`${indent}${connector}${this.applyStyle(child.metadata.serviceName, childStyle)}`);
            
            // Calculate new indent for child nodes
            const newIndent = isLastChild ? indent + "        " : indent + "|       ";
            // Recursive call for child nodes with updated indent
            this.displayProcessNode(child, newIndent);
        });
    }

    private applyStyle(text: string, style: TerminalStyles): string {
        return `${style}${text}${TerminalStyles.Reset}`;
    }
}
