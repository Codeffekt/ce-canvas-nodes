import { TranslateAction } from "../drag";
import { CE_CANVAS_DRAGGED, TranslateEvent } from "../events";
import { Style } from "../style";
import { PathBuilder } from "../SVG";
import { SVG } from "../SVG/SVG";
import { BlockId } from "./BlockId";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";
import { Connector } from "./Connector";

export class Canvas {

    private svgContainer: SVGElement;
    private groupContainer: SVGElement;
    private connectors: Connector[] = [];
    private nodes: CanvasNodeElt[] = [];
    private style = new Style();

    constructor(private root: HTMLElement) {
        this.initRoot();
        this.initCanvasNodes();
        this.initEventListeners();
        this.createActions();
    }

    updateConnectors(connectors: Connector[]) {
        this.connectors = connectors;
        this.clearSVG();
        this.buildSVGConnectors();
    }

    getBlockFromId(blockId: BlockId): CanvasBlockElt {
        const node = this.nodes.find(elt => elt.id() === blockId.nodeId);        
        return node.getBlockFromId(blockId.blockId);
    }    

    private initRoot() {
        this.initContainerStyle(this.root, this.style);
        this.initSVG(this.root, this.style);
    }

    private initContainerStyle(root: HTMLElement, style: Style) {
        style.applyRootStyle(root);
    }

    private initSVG(root: HTMLElement, style: Style) {
        const container = SVG.createContainer(style);
        const defsElement = SVG.createDefs();
        const markers = style.createMarkerElements();
        for (const marker of markers) {
            defsElement.appendChild(marker);
        }
        container.appendChild(defsElement);
        const groupElement = style.createGroupElement();
        container.appendChild(groupElement);
        root.appendChild(container);

        this.svgContainer = container;
        this.groupContainer = groupElement;
    }

    private clearSVG() {
        SVG.clearPaths(this.groupContainer);
    }

    private buildSVGConnectors() {
        for (let connector of this.connectors) {
            const anchorPair = PathBuilder.findBestAnchorPair(connector.getSrc(), connector.getDst());
            const id = CanvasIds.forConnector(connector);
            const path = SVG.createPath(
                anchorPair.src,
                anchorPair.dst,
                id,
                this.style);
            this.groupContainer.appendChild(path);
        }
    }

    private initEventListeners() {
        document.addEventListener(CE_CANVAS_DRAGGED, () => {
            this.updateConnectors(this.connectors);
        });
    }

    private initCanvasNodes() {
        for (let child of Array.from(this.root.children)) {
            if (child instanceof HTMLElement &&
                child.classList.contains(CanvasIds.getCanvasNodeClassName())) {
                this.nodes.push(new CanvasNodeElt(child));
            }
        }
    }

    private createActions() {
        new TranslateAction(this.root, TranslateEvent.forCanvas(this));
    }
}