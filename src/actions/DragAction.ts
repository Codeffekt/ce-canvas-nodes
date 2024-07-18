import { Canvas } from "../canvas";
import { DragEventProvider } from "../events/DragEvent";
import { CoordsUtils } from "../utils/CoordsUtils";

export class DragAction {

    private pos = {
        x: 0,
        y: 0
    };

    constructor(
        private canvas: Canvas,
        private elt: HTMLElement,
        private evtProvider: DragEventProvider
    ) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.elt.addEventListener("mousedown", (event: MouseEvent) => {
            this.onDragMouseDown(event);
        });

    }

    private onDragMouseDown(event: MouseEvent) {
        this.evtProvider.onElementStartDragging();
        event.preventDefault();
        this.pos.x = event.clientX;
        this.pos.y = event.clientY;
        document.onmouseup = () => this.closeDragElement();
        document.onmousemove = (event) => this.elementDrag(event);
    }

    private closeDragElement() {
        this.evtProvider.onElementEndDragging();
        document.onmouseup = null;
        document.onmousemove = null;
    }

    private elementDrag(event: MouseEvent) {
        event.preventDefault();
        const deltaX = CoordsUtils.applyScale(this.canvas, this.pos.x - event.clientX);
        const deltaY = CoordsUtils.applyScale(this.canvas, this.pos.y - event.clientY);
        this.pos.x = event.clientX;
        this.pos.y = event.clientY;
        this.elt.style.top = (this.elt.offsetTop - deltaY) + "px";
        this.elt.style.left = (this.elt.offsetLeft - deltaX) + "px";
        this.evtProvider.onElementDragged();
    }
}