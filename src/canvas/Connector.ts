import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { BlockId } from "./BlockId";



export class Connector {    

    static ATTRIBUTE_NAME = "link";    
    static ATTRIBUTE_STYLE = "link-style";

    static DEFAULT_LINK_STYLE = "arrow";

    constructor(
        private src: CanvasBlockElt, 
        private dst: CanvasBlockElt,
        private linkStyle: string,
    ) {        
    }

    static fromElementsId(
        canvas: Canvas,
        srcId: BlockId, 
        dstId: BlockId,
        linkStyle: string,
    ) {        
        
        const srcBlock = canvas.getBlockFromId(srcId);
        const dstBlock = canvas.getBlockFromId(dstId);

        if(!srcBlock || !dstBlock) {
            return undefined;
        }

        const connector = new Connector(srcBlock, dstBlock, linkStyle);

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
        return this.linkStyle;
    }
}