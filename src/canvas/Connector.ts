import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { BlockId } from "./BlockId";



export class Connector {    

    static ATTRIBUTE_NAME = "link";

    constructor(private src: CanvasBlockElt, private dst: CanvasBlockElt) {        
    }

    static fromElementsId(
        canvas: Canvas,
        srcId: BlockId, 
        dstId: BlockId) {        
        
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
}