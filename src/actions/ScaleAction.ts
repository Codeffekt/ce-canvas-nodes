import { Canvas, CanvasTransform } from "../canvas";
import { CSS } from "../CSS";
import { TransformEventProvider } from "../events/TransformEvent";

export class ScaleAction {    

    private transform: CanvasTransform = {
        translation: {
            tx: 0,
            ty: 0,
        },
        scale: 1,
    };    

    constructor(private canvas: Canvas, private evtProvider: TransformEventProvider) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.canvas.getContainer().addEventListener("wheel", (event: WheelEvent) => {
            this.onMouseWheel(event);
        });
    }

    private onMouseWheel(event: WheelEvent) {

        event.preventDefault();
        
        const dy = event.deltaY;
        this.retrieveCurrentTransform();

        this.transform.scale += dy * -0.001;        
        // Restrict scale
        this.transform.scale = Math.min(Math.max(0.125, this.transform.scale), 4);
        this.applyTransform();

        this.evtProvider.onElementTransform(this.transform);
        this.evtProvider.onElementEndTransform(this.transform);
    }

    private applyTransform() {
        CSS.applyTransformOnStyle(this.canvas.getNodesContainer(), this.transform);        
    }

    private retrieveCurrentTransform() {
        CSS.updateTransform(this.canvas.getNodesContainer(), this.transform);        
    }
}
