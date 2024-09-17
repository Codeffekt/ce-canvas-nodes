import { DragAction } from "../actions/DragAction";
import { DisposeInterface, Vector2 } from "../core";
import { CSS } from "../CSS";
import { DragEvent } from "../events/DragEvent";
import { CoordsUtils, HTMLUtils } from "../utils";
import { Canvas } from "./Canvas";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";

export class CanvasNodeElt implements DisposeInterface {

    static ATTRIBUTE_X = "x";
    static ATTRIBUTE_Y = "y";

    private blocks: CanvasBlockElt[] = [];
    private observer: MutationObserver;
    private actions: DisposeInterface[] = [];
    private coords: Vector2 = {
        x: 0,
        y: 0
    };

    constructor(private canvas: Canvas, private src: HTMLElement) {
        this.retrieveBlocks();
        this.retrieveCoords();
        this.createObserver();
        this.createActions();
    }

    dispose() {
        this.observer.disconnect();
        for (const block of this.blocks) {
            block.dispose();
        }
        for (const action of this.actions) {
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
        this.setCoords({
            x: this.coords.x + delta.x,
            y: this.coords.y + delta.y
        });
    }

    setCoords(coords: Vector2) {        
        this.coords = coords;
        this.src.setAttribute(CanvasNodeElt.ATTRIBUTE_X, this.coords.x.toString());
        this.src.setAttribute(CanvasNodeElt.ATTRIBUTE_Y, this.coords.y.toString());        
    }

    getCoords() {
        return this.coords;
    }

    private retrieveBlocks() {
        for (let child of Array.from(this.src.getElementsByClassName(CanvasIds.getCanvasBlockClassName()))) {
            if (child instanceof HTMLElement) {
                this.blocks.push(new CanvasBlockElt(child, this));
            }
        }
    }

    private retrieveCoords() {
        this.coords = {
            x: HTMLUtils.getFloatAttribute(this.src, CanvasNodeElt.ATTRIBUTE_X) ?? 0,
            y: HTMLUtils.getFloatAttribute(this.src, CanvasNodeElt.ATTRIBUTE_Y) ?? 0
        };
        this.applyCoords();
    }

    private applyCoords() {
        const offset = CoordsUtils.canvasCoordsNormToOffset(
            this.canvas,
            this.coords
        );
        CSS.setEltUpperLeftPos(
            this.src,
            offset.x,
            offset.y
        );
    }

    private updateCoordX() {        
        this.coords.x = HTMLUtils.getFloatAttribute(this.src, CanvasNodeElt.ATTRIBUTE_X) ?? 0;
        this.applyCoords();
    }

    private updateCoordY() {        
        this.coords.y = HTMLUtils.getFloatAttribute(this.src, CanvasNodeElt.ATTRIBUTE_Y) ?? 0;
        this.applyCoords();
    }

    private createActions() {
        this.actions.push(new DragAction(this.canvas, this, DragEvent.forCanvasNodeElts([this])));
    }

    private observeNodeChanges(mutationList: MutationRecord[], observer) {
        let nodeHasMoved = false;
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                this.removeBlocksFromChanges(mutation.removedNodes);
                this.addBlocksFromChanges(mutation.addedNodes);
            } else if (mutation.type === "attributes" &&
                mutation.target === this.src) {
                if (mutation.attributeName === CanvasNodeElt.ATTRIBUTE_X) {
                    this.updateCoordX();
                    nodeHasMoved = true;
                } else if (mutation.attributeName === CanvasNodeElt.ATTRIBUTE_Y) {
                    this.updateCoordY();
                    nodeHasMoved = true;
                }
            }
        }
        if(nodeHasMoved) {
            this.canvas.updateConnectors();
        }
    }

    private removeBlocksFromChanges(nodeList: NodeList) {
        const blocksToBeRemoved = Array.from(nodeList)
            .map(node => this.getBlockFromNode(node))
            .filter(block => block !== undefined);
        for (const block of blocksToBeRemoved) {
            this.canvas.removeBlockFromId(block.createBlockId());
        }
    }

    private addBlocksFromChanges(nodeList: NodeList) {
        const blocksToBeAdded = Array.from(nodeList)
            .filter(node => !this.getBlockFromNode(node))
            .filter(node => node instanceof HTMLElement && node.classList.contains(CanvasIds.getCanvasBlockClassName()))
            .map(node => new CanvasBlockElt(node as HTMLElement, this));
        for (const block of blocksToBeAdded) {
            this.blocks.push(block);
        }
        this.canvas.updateConnectors();
    }

    private createObserver() {
        this.observer = new MutationObserver((mutationList, observer) => this.observeNodeChanges(mutationList, observer));
        this.observer.observe(this.src, { attributes: true, childList: true, subtree: true });
    }
}