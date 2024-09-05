import { CanvasNodeElt } from "../canvas";
import { CSS } from "../CSS";
import { AutoLayout } from "./AutoLayout";

export interface SingleRowAutoLayoutConfig {
    hSpacing: number;
}

export class SingleRowAutoLayout implements AutoLayout {

    constructor(        
        private config: SingleRowAutoLayoutConfig = {
        hSpacing: 10
    }) {}

    autoLayout(nodes: CanvasNodeElt[],) {

        if(!nodes.length) {
            return;
        }

        // take the first node as origin then
        // put others on the right        
        for(let i = 1; i < nodes.length; ++i) {

            const prevElt = nodes[i - 1].getElement();
            const curElt = nodes[i].getElement();            

            CSS.setEltUpperLeftPos(
                curElt,
                prevElt.offsetLeft + prevElt.offsetWidth + this.config.hSpacing,
                prevElt.offsetTop,
            );
        }
    }
}