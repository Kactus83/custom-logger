import { IServiceMetadata } from "../../types/ServiceMetadata";
import { ProcessNode } from "./ProcessNode";

export class ProcessTree {
    root: ProcessNode | null = null;

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

    findProcessById(id: string): ProcessNode | undefined {
        return this.root?.findNodeById(id);
    }
}
