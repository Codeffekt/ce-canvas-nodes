import { DragAction } from "../actions/DragAction";
import { DisposeInterface, Vector2 } from "../core";
import { CSS } from "../CSS";
import { DragEvent } from "../events/DragEvent";
import { CoordsUtils } from "../utils";
import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";

export class CanvasNodeElt implements DisposeInterface {

    static ATTRIBUTE_X = "x";
    static ATTRIBUTE_Y = "y";

    private blocks: CanvasBlockElt[] = [];
    private observer: MutationObserver;
    private actions: DisposeInterface[] = [];    

    constructor(private canvas: Canvas, private src: HTMLElement) {
        this.retrieveBlocks();        
        this.createObserver();
        this.createActions();
    }

    dispose() {
        this.observer.disconnect();
        for(const block of this.blocks) {
            block.dispose();
        }
        for(const action of this.actions) {
            action.dispose();
        }
    }

    id() {
        return this.src.id;
    }

    getCanvas() {
        return this.canvas;
    }

    getBlocks() {
        return this.blocks;
    }    

    getBlockFromId(id: string) {
        return this.blocks.find(elt => elt.id() === id);
    }

    getBlockFromNode(node: Node) {
        return this.blocks.find(elt => elt.nativeElement() === node);
    }

    getElement() {
        return this.src;
    }

    removeBlockFromId(id: string): CanvasBlockElt | undefined {
        const block = this.getBlockFromId(id);
        this.blocks = this.blocks.filter(block => block.id() !== id);
        block.dispose();
        return block;
    }

    translate(delta: Vector2) {
        CSS.setEltUpperLeftPos(this.src,
            this.src.offsetLeft + delta.x,
            this.src.offsetTop + delta.y
        );
    }

    private retrieveBlocks() {
        for (let child of Array.from(this.src.getElementsByClassName(CanvasIds.getCanvasBlockClassName()))) {
            if (child instanceof HTMLElement) {
                this.blocks.push(new CanvasBlockElt(child, this));
            }
        }
    }    

    private createActions() {
        this.actions.push(new DragAction(this.canvas, this.src, DragEvent.forCanvasNodeElt(this)));
    }

    private observeNodeChanges(mutationList: MutationRecord[], observer) {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                this.removeBlocksFromChanges(mutation.removedNodes);
                this.addBlocksFromChanges(mutation.addedNodes);
            }
        }
    }

    private removeBlocksFromChanges(nodeList: NodeList) {
        const blocksToBeRemoved = Array.from(nodeList)
            .map(node => this.getBlockFromNode(node))
            .filter(block => block !== undefined);
        for(const block of blocksToBeRemoved) {
            this.canvas.removeBlockFromId(block.createBlockId());
        }
    }

    private addBlocksFromChanges(nodeList: NodeList) {  
        const blocksToBeAdded = Array.from(nodeList)
            .filter(node => !this.getBlockFromNode(node))
            .filter(node => node instanceof HTMLElement && node.classList.contains(CanvasIds.getCanvasBlockClassName()))
            .map(node => new CanvasBlockElt(node as HTMLElement, this));
        for(const block of blocksToBeAdded) {
            this.blocks.push(block);
        }
        this.canvas.updateConnectors();
    }

    private createObserver() {
        this.observer = new MutationObserver((mutationList, observer) => this.observeNodeChanges(mutationList, observer));
        this.observer.observe(this.src, { attributes: false, childList: true, subtree: true });
    }
}