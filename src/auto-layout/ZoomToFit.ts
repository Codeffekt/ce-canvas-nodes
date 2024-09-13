import { Canvas, CanvasTransform } from "../canvas";
import { CSS } from "../CSS";
import { TransformEvent } from "../events";
import { AutoLayout } from "./AutoLayout";
import { CenterElts } from "./CenterElts";
import { AutoLayoutUtils } from "./utils";

export interface ZoomToFitConfig {
    wantedRatio: number;
}

export class ZoomToFit implements AutoLayout {

    constructor(private config: ZoomToFitConfig = { wantedRatio: 0.8 }) {}

    autoLayout(canvas: Canvas) { 
        canvas.applyAutoLayout(new CenterElts());       
        this.zoomElts(canvas);        
    }

    private zoomElts(canvas: Canvas) {
        const nodes = canvas.getNodes();

        if(!nodes.length) {
            return;
        }

        const bbox = AutoLayoutUtils.computeNodesBBox(nodes);       

        const transform = this.retrieveCurrentTransform(canvas);        

        const containerBox = canvas.getContainer().getBoundingClientRect();        

        const wantedRatio = this.config.wantedRatio;
        const wantedWidth = Math.floor((containerBox.right - containerBox.left) * wantedRatio);
        const wantedHeight = Math.floor((containerBox.bottom - containerBox.top) * wantedRatio);                
        
        const curWidth = (bbox.right - bbox.left) / transform.scale;
        const curHeight = (bbox.bottom - bbox.top) / transform.scale;
        
        const wantedScale =  curWidth > curHeight ? wantedWidth / curWidth : wantedHeight / curHeight;                     

        transform.scale = wantedScale;

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