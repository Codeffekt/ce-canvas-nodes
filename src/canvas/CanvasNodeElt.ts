import { DragAction } from "../actions/DragAction";
import { DragEvent } from "../events/DragEvent";
import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";

export class CanvasNodeElt {

    private blocks: CanvasBlockElt[] = [];

    constructor(private canvas: Canvas, private src: HTMLElement) {
        this.retrieveBlocks();
        this.createActions();
    }

    id() {
        return this.src.id;
    }

    getCanvas() {
        return this.canvas;
    }

    getBlockFromId(id: string) {
        return this.blocks.find(elt => elt.id() === id);
    }

    private retrieveBlocks() {
        for (let child of Array.from(this.src.children)) {
            if (child instanceof HTMLElement &&
                child.classList.contains(CanvasIds.getCanvasBlockClassName())) {
                this.blocks.push(new CanvasBlockElt(child, this));
            }
        }
    }

    private createActions() {
        new DragAction(this.canvas, this.src, DragEvent.forCanvasNodeElt(this));        
    }
}