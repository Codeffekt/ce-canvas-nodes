import { Canvas, CanvasTransform } from "../canvas";
import { Vector2 } from "../core";
import { CSS } from "../CSS";
import { TransformEvent } from "../events";
import { CoordsUtils } from "../utils";
import { AutoLayout } from "./AutoLayout";
import { AutoLayoutUtils } from "./utils";

export class CenterElts implements AutoLayout {

    constructor() {}

    autoLayout(canvas: Canvas) {                
        this.centerElts(canvas);
    }

    private centerElts(canvas: Canvas) {
        const nodes = canvas.getNodes();

        if(!nodes.length) {
            return;
        }        

        const bbox = AutoLayoutUtils.computeNodesBBox(nodes);       

        const transform = this.retrieveCurrentTransform(canvas);

        const bboxCenter: Vector2 = {
            x: (bbox.left + bbox.right) / 2,
            y: (bbox.top + bbox.bottom) / 2
        };

        console.log(bboxCenter);

        const containerBox = canvas.getContainer().getBoundingClientRect();

        const containerCenter: Vector2 = {
            x: (containerBox.left + containerBox.right) / 2,
            y: (containerBox.top + containerBox.bottom) / 2
        };        

        const delta: Vector2 = CoordsUtils.applyScale(canvas, {
            x: containerCenter.x - bboxCenter.x + transform.translation.tx,
            y: containerCenter.y - bboxCenter.y + transform.translation.ty,
        });        

        transform.translation.tx = 0; 
        transform.translation.ty = 0;        

        this.applyTransform(canvas.getNodesContainer(), transform);
        CSS.setEltUpperLeftPos(canvas.getNodesContainer(), 0, 0);

        for(const node of nodes) {
            node.translate(delta)
        }

        const provider = TransformEvent.forCanvas(canvas);
        provider.onElementTransform(transform);
    }    

    private retrieveCurrentTransform(canvas: Canvas) {
        return CSS.updateTransform(canvas.getNodesContainer());        
    }

    private applyTransform(elt: HTMLElement, transform: CanvasTransform) {
        CSS.applyTransformOnStyle(elt, transform);        
    }
    
}