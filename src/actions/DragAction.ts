import { Canvas, CanvasNodeElt } from "../canvas";
import { DragEventProvider } from "../events/DragEvent";
import { CoordsUtils } from "../utils/CoordsUtils";
import { CSS } from "../CSS";
import { DisposeInterface, Vector2 } from "../core";

export class DragAction implements DisposeInterface {

    private mousePos: Vector2 = {
        x: 0,
        y: 0
    };   

    private wasDragged = false;

    constructor(
        private canvas: Canvas,
        private node: CanvasNodeElt,
        private evtProvider: DragEventProvider
    ) {
        this.createEventListeners();
    }

    dispose() {
    }

    private createEventListeners() {

        this.node.getElement().addEventListener("mousedown", (event: MouseEvent) => {
            this.onDragMouseDown(event);
        });

    }

    private onDragMouseDown(event: MouseEvent) {
        this.evtProvider.onElementStartDragging();
        event.preventDefault();
        this.wasDragged = false;
        this.mousePos.x = event.clientX;
        this.mousePos.y = event.clientY;
        document.onmouseup = () => {
            this.closeDragElement();
            this.wasDragged = false;
        };
        document.onmousemove = (event) => {
            this.wasDragged = true;            
            this.elementDrag(event);
        };
    }

    private closeDragElement() {                  
        this.node.setCoords(
            CoordsUtils.elementOffsetToCanvasCoordsNorm(
                this.canvas, 
                this.node.getElement())
        );
        document.onmouseup = null;
        document.onmousemove = null;
        if(this.wasDragged) {
            this.evtProvider.onElementEndDragging();     
        }
    }

    private elementDrag(event: MouseEvent) {
        event.preventDefault();
        const delta: Vector2 = CoordsUtils.applyScale(this.canvas,
            {
                x: this.mousePos.x - event.clientX,
                y: this.mousePos.y - event.clientY
            });        
        this.mousePos.x = event.clientX;
        this.mousePos.y = event.clientY;
        const nodeOffsetCoords = {
            x: this.node.getElement().offsetLeft - delta.x,
            y: this.node.getElement().offsetTop - delta.y
        };
        CSS.setEltUpperLeftPos(
            this.node.getElement(),
            nodeOffsetCoords.x,
            nodeOffsetCoords.y
        );
        this.evtProvider.onElementDragged();
    }
}