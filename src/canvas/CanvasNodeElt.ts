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

    getElement() {
        return this.src;
    }

    private retrieveBlocks() {
        for (let child of Array.from(this.src.getElementsByClassName(CanvasIds.getCanvasBlockClassName()))) {
            if (child instanceof HTMLElement) {
                this.blocks.push(new CanvasBlockElt(child, this));
            }
        }
    }

    private createActions() {
        new DragAction(this.canvas, this.src, DragEvent.forCanvasNodeElt(this));
    }
}