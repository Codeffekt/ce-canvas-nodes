import { Canvas, CanvasTransform } from "../canvas";
import { CSS } from "../CSS";
import { TransformEventProvider } from "../events/TransformEvent";

export class TranslateAction {

    private isDragging = false;

    private start = {
        x: 0,
        y: 0
    };

    private client = {
        x: 0,
        y: 0
    };

    private transform: CanvasTransform = {
        translation: {
            tx: 0,
            ty: 0
        },
        scale: 1
    }    

    constructor(private canvas: Canvas, private evtProvider: TransformEventProvider) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.canvas.getContainer().addEventListener("mousedown", (event: MouseEvent) => {
            this.onDragMouseDown(event);
        });
    }

    private onDragMouseDown(event: MouseEvent) {

        if (event.button !== 1) {
            return false;
        }
        
        this.isDragging = true;
        event.preventDefault();

        this.client.x = event.clientX;
        this.client.y = event.clientY;

        this.retrieveCurrentTransform();

        this.start.x = this.transform.translation.tx;
        this.start.y = this.transform.translation.ty;

        document.onmouseup = () => this.closeDragElement();
        document.onmousemove = (event) => this.elementDrag(event);  
        
        this.evtProvider.onElementStartTransform(this.transform);
    }

    private closeDragElement() {
        this.evtProvider.onElementEndTransform(this.transform);
        this.isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }

    private elementDrag(event: MouseEvent) {

        if (!this.isDragging) {
            return;
        }

        event.preventDefault();

        const direction = 1;
        this.transform.translation.tx = this.start.x + (event.clientX - this.client.x) * direction;
        this.transform.translation.ty = this.start.y + (event.clientY - this.client.y) * direction;
        this.applyTransform();
        this.evtProvider.onElementTransform(this.transform);
    }

    private applyTransform() {
        CSS.applyTransformOnStyle(this.canvas.getNodesContainer(), this.transform);        
    }

    private retrieveCurrentTransform() {
        CSS.updateTransform(this.canvas.getNodesContainer(), this.transform);        
    }
}