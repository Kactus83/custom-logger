import { MainProcessMetadata, SubProcessMetadata } from "../../types/ServiceMetadata";
import { ProcessNode } from "./ProcessNode";
import { ProcessTree } from "./ProcessTree";

export class ProcessDatabase {
    private trees: Map<string, ProcessTree>;
    private nameCounter: Map<string, number>; 
    private maxServiceNameLength: number = 0;

    constructor() {
        this.trees = new Map();
        this.nameCounter = new Map();
    }

    generateUniqueId(name: string): string {
        const count = this.nameCounter.get(name) || 0;
        this.nameCounter.set(name, count + 1);
        return `${name}_${count + 1}`;
    }    

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

    findProcessById(id: string): ProcessNode | undefined {
        for (let tree of this.trees.values()) {
            const foundNode = tree.findProcessById(id);
            if (foundNode) {
                return foundNode;
            }
        }
        return undefined;
    }
    
    // Méthode pour mettre à jour la longueur maximale du nom de service
    private updateMaxServiceNameLength(serviceName: string): void {
        if (serviceName.length > this.maxServiceNameLength) {
            this.maxServiceNameLength = serviceName.length;
        }
    }

    // Méthode pour récupérer la longueur maximale du nom de service
    public getMaxServiceNameLength(): number {
        return this.maxServiceNameLength;
    }
}
