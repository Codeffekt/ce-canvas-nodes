import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { BlockId } from "./BlockId";



export class Connector {    

    constructor(private src: CanvasBlockElt, private dst: CanvasBlockElt) {        
    }

    static fromElementsId(
        canvas: Canvas,
        srcId: BlockId, 
        dstId: BlockId) {        
        
        const connector = new Connector(
            canvas.getBlockFromId(srcId), 
            canvas.getBlockFromId(dstId));

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