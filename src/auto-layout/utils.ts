import { CanvasNodeElt } from "../canvas";

export interface BBox {
    top: number;
    left: number;   
    right: number;
    bottom: number;
}

export class AutoLayoutUtils {

    static computeNodesBBox(nodes: CanvasNodeElt[]): BBox {

        if(!nodes.length) {
            throw new Error("Empty nodes list");
        }        

        const firstElt = nodes[0].getElement();

        const firstEltBox = firstElt.getBoundingClientRect();

        const bbox = {
            left: firstEltBox.left,
            right: firstEltBox.right,
            top: firstEltBox.top,            
            bottom: firstEltBox.bottom,
        };        

        for(let i = 1; i < nodes.length; ++i) {
            const curElt = nodes[i].getElement();                        
            const curEltBox = curElt.getBoundingClientRect();            
            bbox.left = Math.min(bbox.left, curEltBox.left);
            bbox.top = Math.min(bbox.top, curEltBox.top);
            bbox.right = Math.max(bbox.right, curEltBox.right);
            bbox.bottom = Math.max(bbox.bottom, curEltBox.bottom);
        }

        return bbox;
    }

}