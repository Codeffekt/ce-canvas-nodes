import { TranslateAction } from "../actions";
import { ScaleAction } from "../actions/ScaleAction";
import { CE_CANVAS_DRAGGED } from "../events";
import { CE_CANVAS_TRANSFORMED, CustomTransformEvent, TransformEvent } from "../events/TransformEvent";
import { Style } from "../style";
import { PathBuilder } from "../SVG";
import { SVG } from "../SVG/SVG";
import { BlockId } from "./BlockId";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";
import { CanvasTransform } from "./CanvasTransform";
import { Connector } from "./Connector";

export class Canvas {

    private svgContainer: SVGElement;
    private groupContainer: SVGElement;
    private connectors: Connector[] = [];
    private nodes: CanvasNodeElt[] = [];
    private style = new Style();
    private transform: CanvasTransform = {
        translation: {
            tx: 0,
            ty: 0,
        },
        scale: 1,
    };

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

    getCanvasElt() {
        return this.root;
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
            const anchorPair = PathBuilder.findBestAnchorPoints(
                this,
                connector.getSrc(),
                connector.getDst()
            );            

            const id = CanvasIds.forConnector(connector);
            const path = SVG.createPath(                
                anchorPair.a,
                anchorPair.b,
                id,
                this.style);
            this.groupContainer.appendChild(path);
        }
    } 

    private initEventListeners() {
        document.addEventListener(CE_CANVAS_DRAGGED, () => {
            this.updateConnectors(this.connectors);
        });
        document.addEventListener(CE_CANVAS_TRANSFORMED, (evt: CustomEvent<CustomTransformEvent>) => {
            this.transform = evt.detail.transform;                 
            this.updateConnectors(this.connectors);
        });
    }

    private initCanvasNodes() {
        for (let child of Array.from(this.root.children)) {
            if (child instanceof HTMLElement &&
                child.classList.contains(CanvasIds.getCanvasNodeClassName())) {
                this.nodes.push(new CanvasNodeElt(this, child));
            }
        }
    }

    private createActions() {
        new TranslateAction(this.root, TransformEvent.forCanvas(this));
        new ScaleAction(this.root, TransformEvent.forCanvas(this));
    }
}
