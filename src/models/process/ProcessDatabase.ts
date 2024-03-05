import { MainProcessMetadata, SubProcessMetadata } from "../../types/ServiceMetadata";
import { ProcessNode } from "./ProcessNode";
import { ProcessTree } from "./ProcessTree";

/**
 * Manages a collection of process trees, uniquely identifying each process within the system.
 */
export class ProcessDatabase {
    private trees: Map<string, ProcessTree>;
    private nameCounter: Map<string, number>; 
    private maxServiceNameLength: number = 0;

    /**
     * Constructs a new ProcessDatabase instance.
     */
    constructor() {
        this.trees = new Map();
        this.nameCounter = new Map();
    }

    /**
     * Provides access to the collection of process trees.
     * @returns {Map<string, ProcessTree>} A map of process trees keyed by their root process ID.
     */
    public getTrees(): Map<string, ProcessTree> {
        return this.trees;
    }

    /**
     * Generates a unique identifier for a given process name.
     * @param {string} name - The name of the process.
     * @returns {string} A unique identifier for the process.
     */
    generateUniqueId(name: string): string {
        const count = this.nameCounter.get(name) || 0;
        this.nameCounter.set(name, count + 1);
        return `${name}_${count + 1}`;
    }    

    /**
     * Adds a main process to the database and returns its unique ID.
     * @param {MainProcessMetadata} metadata - Metadata of the main process.
     * @returns {string} The unique ID of the added main process.
     */
    addMainProcess(metadata: MainProcessMetadata): string {
        const id = this.generateUniqueId(metadata.serviceName);
        if (this.trees.has(id)) {
            throw new Error(`Main process with ID ${id} already exists.`);
        }
        const newTree = new ProcessTree();
        newTree.addProcess(null, metadata, id);
        this.trees.set(id, newTree);
        this.updateMaxServiceNameLength(metadata.serviceName);
        return id;
    }

    /**
     * Adds a sub-process under an existing main process.
     * @param {string} parentId - The ID of the parent main process.
     * @param {SubProcessMetadata} metadata - Metadata of the sub-process.
     * @returns {string} The unique ID of the added sub-process.
     */
    addSubProcess(parentId: string, metadata: SubProcessMetadata): string {
        const id = this.generateUniqueId(metadata.serviceName);
        for (let tree of this.trees.values()) {
            const parentProcess = tree.findProcessById(parentId);
            if (parentProcess) {
                tree.addProcess(parentId, metadata, id);
                this.updateMaxServiceNameLength(metadata.serviceName);
                return id;
            }
        }
        throw new Error(`Parent process with ID ${parentId} not found in any tree.`);
    }

    /**
     * Finds a process node by its ID.
     * @param {string} id - The ID of the process to find.
     * @returns {ProcessNode | undefined} The found process node, or undefined if not found.
     */
    findProcessById(id: string): ProcessNode | undefined {
        for (let tree of this.trees.values()) {
            const foundNode = tree.findProcessById(id);
            if (foundNode) {
                return foundNode;
            }
        }
        return undefined;
    }   

    /**
     * Updates the maximum recorded length of process names.
     * @param {string} serviceName - The name of the service.
     */
    private updateMaxServiceNameLength(serviceName: string): void {
        if (serviceName.length > this.maxServiceNameLength) {
            this.maxServiceNameLength = serviceName.length;
        }
    }

    /**
     * Retrieves the maximum length of service names encountered.
     * @returns {number} The maximum length of service names.
     */
    public getMaxServiceNameLength(): number {
        return this.maxServiceNameLength;
    }
}
