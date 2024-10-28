import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { BlockId } from "./BlockId";

export type ConnectorDirection = "forward" | "backward" | null;

export class Connector {    

    static ATTRIBUTE_NAME = "link";    
    static ATTRIBUTE_STYLE = "link-style";
    static ATTRIBUTE_DIRECTION = "link-direction";

    static DIRECTION_FORWARD: ConnectorDirection = "forward";
    static DIRECTION_BACKWARD: ConnectorDirection = "backward";

    static DEFAULT_LINK_STYLE = "arrow";
    static DEFAULT_LINK_DIRECTION: ConnectorDirection = "forward";

    constructor(
        private src: CanvasBlockElt, 
        private dst: CanvasBlockElt,        
    ) {        
    }

    static fromElementsId(
        canvas: Canvas,
        srcId: BlockId, 
        dstId: BlockId,        
    ) {        
        
        const srcBlock = canvas.getBlockFromId(srcId);
        const dstBlock = canvas.getBlockFromId(dstId);

        if(!srcBlock || !dstBlock) {
            return undefined;
        }

        const connector = new Connector(srcBlock, dstBlock);

        return connector;
    }
    
    getSrcId() {
        return this.src.id();
    }

    getDstId() {
        return this.dst.id();
    }

    getSrc() {
        return this.src;
    }

    getDst() {
        return this.dst;
    }

    getLinkStyle() {
        return this.src.getLinkStyle();
    }

    getLinkDirection() {
        return this.src.getLinkDirection();
    }

    isLinkBackward() {
        return this.getLinkDirection() === "backward";
    }
}