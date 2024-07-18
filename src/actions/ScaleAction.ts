import { CanvasTransform } from "../canvas";
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

    constructor(private elt: HTMLElement, private evtProvider: TransformEventProvider) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.elt.addEventListener("wheel", (event: WheelEvent) => {
            this.onMouseWheel(event);
        });
    }

    private onMouseWheel(event: WheelEvent) {

        event.preventDefault();
        
        const dy = event.deltaY;

        console.log("deltaY = ", dy);        
        this.retrieveCurrentTransform();

        // var originRec = this.container.getBoundingClientRect();
        // zoom
        const zoom_target = { x: 0, y: 0 }
        const zoom_point = { x: 0, y: 0 }
        zoom_point.x = event.pageX - this.elt.offsetLeft; // - originRec.x;
        zoom_point.y = event.pageY - this.elt.offsetTop; // - originRec.y;
        zoom_target.x = (zoom_point.x - this.transform.translation.tx) / this.transform.scale;
        zoom_target.y = (zoom_point.y - this.transform.translation.ty) / this.transform.scale;
        // console.log('drawer: ', this.drawer);        
        this.transform.scale += dy * -0.001;        
        // Restrict scale
        this.transform.scale = Math.min(Math.max(0.125, this.transform.scale), 4);
        this.transform.translation.tx = -zoom_target.x * this.transform.scale + zoom_point.x
        this.transform.translation.ty = -zoom_target.y * this.transform.scale + zoom_point.y
        // Apply scale transform
        this.applyTransform();

        this.evtProvider.onElementTransform(this.transform);
    }

    private applyTransform() {
        CSS.applyTransformOnStyle(this.elt, this.transform);        
    }

    private retrieveCurrentTransform() {
        CSS.updateTransform(this.elt, this.transform);        
    }
}
