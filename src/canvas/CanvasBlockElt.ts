import { CreateConnectorAction, SelectionAction } from "../actions";
import { CreateConnectorEvent, SelectionEvent } from "../events";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";

export class CanvasBlockElt {
        
    private anchors: HTMLElement[] = [];

    constructor(private src: HTMLElement, private parent: CanvasNodeElt) {         
        this.retrieveAnchorsElements();
        this.createActions();
    }
    
    id() {
        return this.src.id;
    }

    nativeElement() {
        return this.src;
    }

    node() {
        return this.parent;
    }

    getBoundingClientRect() {
        return this.src.getBoundingClientRect();
    }    
    
    getAnchors() {
        return this.anchors;
    }

    private retrieveAnchorsElements() {
        this.anchors = Array.from(this.src.getElementsByClassName(CanvasIds.getAnchorClassName())) as HTMLElement[];    

        if(!this.anchors.length) {
            throw new Error(`The block ${this.src.id} has no anchor element`);
        }
    }

    private createActions() {
        new CreateConnectorAction(this, CreateConnectorEvent.forCanvasBlockElt(this));
        new SelectionAction(this.src, SelectionEvent.forCanvasBlock(this));
    }
}