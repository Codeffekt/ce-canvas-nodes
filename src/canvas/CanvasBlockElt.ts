import { CreateConnectorAction, SelectionAction } from "../actions";
import { DisposeInterface } from "../core";
import { CreateConnectorEvent, SelectionEvent } from "../events";
import { BlockId, BlockIdUtils } from "./BlockId";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";
import { Connector } from "./Connector";

export class CanvasBlockElt implements DisposeInterface {

    private anchors: HTMLElement[] = [];
    private observer: MutationObserver;
    private link?: BlockId;

    constructor(private src: HTMLElement, private parent: CanvasNodeElt) {
        this.retrieveAnchorsElements();
        this.retrieveLink();
        this.createObserver();
        this.createActions();
    }

    dispose() {
        this.observer.disconnect();
    }

    id() {
        return this.src.id;
    }

    createBlockId(): BlockId {
        return {
            nodeId: this.parent.id(),
            blockId: this.id()
        };
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

    getLink() {
        return this.link;
    }

    updateLink(dst: BlockId) {
        this.src.setAttribute(Connector.ATTRIBUTE_NAME, BlockIdUtils.createLink(dst));
    }

    private retrieveAnchorsElements() {
        this.anchors = Array.from(this.src.getElementsByClassName(CanvasIds.getAnchorClassName())) as HTMLElement[];
    }

    private retrieveLink() {
        const attribute = this.src.getAttribute(Connector.ATTRIBUTE_NAME);
        this.link = attribute ? BlockIdUtils.createFromLink(attribute) : null;
    }

    private createActions() {
        new CreateConnectorAction(this, CreateConnectorEvent.forCanvasBlockElt(this));
        new SelectionAction(this.src, SelectionEvent.forCanvasBlock(this));
    }

    private observeNodeChanges(mutationList: MutationRecord[], observer) {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes" &&
                mutation.target === this.src &&
                mutation.attributeName === Connector.ATTRIBUTE_NAME) {                
                this.retrieveLink();                
                this.parent.getCanvas().updateConnectors();
            }
        }
    }

    private createObserver() {
        this.observer = new MutationObserver((mutationList, observer) => this.observeNodeChanges(mutationList, observer));
        this.observer.observe(this.src, { attributes: true, childList: false, subtree: false });
    }
}