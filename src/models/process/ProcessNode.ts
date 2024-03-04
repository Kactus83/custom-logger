import { IServiceMetadata } from "../../types/ServiceMetadata";

export class ProcessNode {
    metadata: IServiceMetadata;
    children: Map<string, ProcessNode>;
    id: string; 

    constructor(metadata: IServiceMetadata, id: string) {
        this.metadata = metadata;
        this.children = new Map();
        this.id = id; 
    }

    addChild(node: ProcessNode): void {
        this.children.set(node.id, node);
    }

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
