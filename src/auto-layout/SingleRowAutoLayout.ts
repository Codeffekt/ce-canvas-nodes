import { Canvas } from "../canvas";
import { DragEvent } from "../events";
import { CoordsUtils } from "../utils";
import { AutoLayout } from "./AutoLayout";

export interface SingleRowAutoLayoutConfig {
    hSpacing: number;
}

export class SingleRowAutoLayout implements AutoLayout {

    constructor(        
        private config: SingleRowAutoLayoutConfig = {
        hSpacing: 10
    }) {}

    autoLayout(canvas: Canvas) {

        const nodes = canvas.getNodes();

        if(!nodes.length) {
            return;
        }

        // take the first node as origin then
        // put others on the right        
        for(let i = 1; i < nodes.length; ++i) {

            const prevElt = nodes[i - 1].getElement();
            const curElt = nodes[i];     

            const newCoord = CoordsUtils.coordsToCanvasCoordsNorm(
                canvas, {
                    x: prevElt.offsetLeft + prevElt.offsetWidth + this.config.hSpacing,
                    y: prevElt.offsetTop,
                }
            );

            curElt.setCoords(newCoord);            
        }

        const provider = DragEvent.forCanvasNodeElts(nodes);
        provider.onElementDragged();
        provider.onElementEndDragging();
    }
}