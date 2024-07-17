import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";

export class CanvasBlockElt {
    
    private leftAnchor: HTMLElement;
    private rightAnchor: HTMLElement;

    constructor(private src: HTMLElement, private parent: CanvasNodeElt) {         
        this.retrieveAnchorsElements();        
    }
    
    id() {
        return this.src.id;
    }

    getBoundingClientRect() {
        return this.src.getBoundingClientRect();
    }

    getLeftAnchor() {
        return this.leftAnchor;
    }

    getRightAnchor() {
        return this.rightAnchor;
    }
    
    private retrieveAnchorsElements() {
        for (let child of Array.from(this.src.children)) {
            if(child.id === CanvasIds.getLeftAnchorId()) {
                this.leftAnchor = child as HTMLElement;
            } else if(child.id === CanvasIds.getRightAnchorId()) {
                this.rightAnchor = child as HTMLElement;
            }
        }
        if(!this.leftAnchor || !this.rightAnchor) {
            throw new Error("Missing left or right anchor ids");
        }
    }
}