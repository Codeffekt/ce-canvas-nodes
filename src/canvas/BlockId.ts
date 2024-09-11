export interface BlockId {
    nodeId: string;
    blockId: string;
}

export class BlockIdUtils {

    static createFromLink(link: string): BlockId {
        const elts = link.trim().split("/").filter((elt) => elt !== "");
        return elts.length < 2 ? null : {
            nodeId: elts[0],
            blockId: elts[1]
        };
    }

    static createLink(blockId: BlockId): string {
        return `${blockId.nodeId}/${blockId.blockId}`;
    }
}