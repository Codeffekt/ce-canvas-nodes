import { Canvas, CanvasTransform } from "../canvas";
import { CSS } from "../CSS";
import { TransformEvent } from "../events";
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

        const bboxCenter = {
            x: (bbox.left + bbox.right) / 2,
            y: (bbox.top + bbox.bottom) / 2
        };

        const containerBox = canvas.getContainer().getBoundingClientRect();

        const containerCenter = {
            x: (containerBox.left + containerBox.right) / 2,
            y: (containerBox.top + containerBox.bottom) / 2
        };        

        transform.translation.tx = transform.translation.tx + containerCenter.x - bboxCenter.x; 
        transform.translation.ty = transform.translation.ty + containerCenter.y - bboxCenter.y;        

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
    
}