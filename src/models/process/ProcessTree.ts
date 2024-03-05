import { IServiceMetadata } from "../../types/ServiceMetadata";
import { ProcessNode } from "./ProcessNode";

/**
 * Represents a single hierarchical tree of processes within the application.
 */
export class ProcessTree {
    root: ProcessNode | null = null;

    /**
     * Adds a new process to the tree.
     * @param {string | null} parentId - The ID of the parent process, or null if adding a root.
     * @param {IServiceMetadata} metadata - The metadata of the process to add.
     * @param {string} id - The unique ID of the process.
     * @returns {ProcessNode} The newly added process node.
     */
    addProcess(parentId: string | null, metadata: IServiceMetadata, id: string): ProcessNode {
        const newNode = new ProcessNode(metadata, id);
        if (!parentId) {
            this.root = newNode;
        } else {
            const parentNode = this.findProcessById(parentId);
            if (!parentNode) {
                throw new Error(`Parent process with ID ${parentId} not found.`);
            }
            parentNode.addChild(newNode);
        }
        return newNode;
    }

    /**
     * Finds a process within the tree by its ID.
     * @param {string} id - The ID of the process to find.
     * @returns {ProcessNode | undefined} The found process node, or undefined if not found.
     */
    findProcessById(id: string): ProcessNode | undefined {
        return this.root?.findNodeById(id);
    }
}
