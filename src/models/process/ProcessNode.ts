import { IServiceMetadata } from "../../types/ServiceMetadata";

/**
 * Represents a node within a process tree, encapsulating the process's metadata and hierarchy.
 */
export class ProcessNode {
    metadata: IServiceMetadata;
    children: Map<string, ProcessNode>;
    id: string; 

    /**
     * Constructs a new ProcessNode instance.
     * @param {IServiceMetadata} metadata - The metadata associated with the process.
     * @param {string} id - The unique identifier of the process.
     */
    constructor(metadata: IServiceMetadata, id: string) {
        this.metadata = metadata;
        this.children = new Map();
        this.id = id; 
    }

    /**
     * Adds a child node to this node.
     * @param {ProcessNode} node - The child node to add.
     */
    addChild(node: ProcessNode): void {
        this.children.set(node.id, node);
    }

    /**
     * Recursively searches for a node by ID within the subtree rooted at this node.
     * @param {string} id - The ID of the node to find.
     * @returns {ProcessNode | undefined} The found node, or undefined if not found.
     */
    findNodeById(id: string): ProcessNode | undefined {
        if (this.id === id) {
            return this;
        }
        for (let child of this.children.values()) {
            const found = child.findNodeById(id);
            if (found) {
                return found;
            }
        }
        return undefined;
    }
}
