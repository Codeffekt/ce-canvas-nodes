import { Canvas, CanvasNodeElt, CanvasTransform } from "../canvas";
import { CSS } from "../CSS";
import { TransformEvent } from "../events";
import { AutoLayout } from "./AutoLayout";

interface BBox {
    top: number;
    left: number;   
    width: number;
    height: number;
}

export class ZoomToFit implements AutoLayout {

    constructor() {}

    autoLayout(canvas: Canvas) {
        
        const nodes = canvas.getNodes();

        if(!nodes.length) {
            return;
        }

        const bbox = this.computeNodesBBox(nodes);

        const transform = this.retrieveCurrentTransform(canvas);

        console.log(transform);

        const bboxCenter = {
            x: (bbox.left + bbox.width) / 2,
            y: (bbox.top + bbox.height) / 2
        };

        console.log(bboxCenter);

        transform.translation.tx = 0; // bboxCenter.x;
        transform.translation.ty = 0; // bboxCenter.y;

        this.applyTransform(canvas, transform);

        const provider = TransformEvent.forCanvas(canvas);
        provider.onElementTransform(transform);
    }

    private retrieveCurrentTransform(canvas: Canvas) {
        return CSS.updateTransform(canvas.getNodesContainer());        
    }

    private applyTransform(canvas: Canvas, transform: CanvasTransform) {
        CSS.applyTransformOnStyle(canvas.getNodesContainer(), transform);        
    }

    private computeNodesBBox(nodes: CanvasNodeElt[]): BBox {

        if(!nodes.length) {
            throw new Error("Empty nodes list");
        }

        const firstElt = nodes[0].getElement();
        const bbox = {
            left: firstElt.offsetLeft,
            top: firstElt.offsetTop,
            width: firstElt.offsetWidth,
            height: firstElt.offsetHeight,
        };

        for(let i = 1; i < nodes.length; ++i) {
            const curElt = nodes[i].getElement();
            bbox.left = Math.min(bbox.left, curElt.offsetLeft);
            bbox.top = Math.min(bbox.top, curElt.offsetTop);
            bbox.width = Math.max(bbox.left + bbox.width, curElt.offsetWidth + curElt.offsetWidth) - bbox.left;
            bbox.height = Math.max(bbox.top + bbox.height, curElt.offsetTop + curElt.offsetHeight) - bbox.top;
        }

        return bbox;
    }
}