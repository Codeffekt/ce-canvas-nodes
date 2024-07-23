import { CreateConnectorAction, SelectionAction } from "../actions";
import { CreateConnectorEvent, SelectionEvent } from "../events";
import { HTMLUtils } from "../utils";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";

export class CanvasBlockElt {
    
    private leftAnchor: HTMLElement;
    private rightAnchor: HTMLElement;

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

    getLeftAnchor() {
        return this.leftAnchor;
    }

    getRightAnchor() {
        return this.rightAnchor;
    }
    
    getAnchors() {
        return [this.leftAnchor, this.rightAnchor];
    }

    private retrieveAnchorsElements() {

        this.leftAnchor = HTMLUtils.findFirstChildWithClass(this.src, CanvasIds.getLeftAnchorClassName());
        this.rightAnchor = HTMLUtils.findFirstChildWithClass(this.src, CanvasIds.getRightAnchorClassName());

        if(!this.leftAnchor || !this.rightAnchor) {
            throw new Error("Missing left or right anchor ids");
        }
    }

    private createActions() {
        new CreateConnectorAction(this, CreateConnectorEvent.forCanvasBlockElt(this));
        new SelectionAction(this.src, SelectionEvent.forCanvasBlock(this));
    }
}