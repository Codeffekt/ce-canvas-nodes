import { TranslateAction } from "../actions";
import { ScaleAction } from "../actions/ScaleAction";
import { AutoLayout } from "../auto-layout";
import { CE_CANVAS_CREATE_CONNECTOR_END, CE_CANVAS_DRAGGED, CE_CANVAS_UPDATE_CONNECTORS, CustomCreateConnectorEvent, CustomUpdateConnectorsEvent } from "../events";
import { CE_CANVAS_TRANSFORMED, CustomTransformEvent, TransformEvent } from "../events/TransformEvent";
import { Style } from "../style";
import { PathBuilder } from "../SVG";
import { SVG } from "../SVG/SVG";
import { HTMLUtils } from "../utils";
import { BlockId } from "./BlockId";
import { CanvasBlockElt } from "./CanvasBlockElt";
import { CanvasIds } from "./CanvasIds";
import { CanvasNodeElt } from "./CanvasNodeElt";
import { CanvasTransform } from "./CanvasTransform";
import { Connector } from "./Connector";

export class Canvas {

    private nodesContainer: HTMLElement;
    private svgContainer: SVGElement;
    private connectorsContainer: SVGElement;
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

    constructor(private canvasContainer: HTMLElement) {
        this.initCanvasNodesContainer();
        this.initCanvasNodes();
        this.initEventListeners();
        this.createActions();
    }

    addNodeFromElement(elt: HTMLElement) {
        const node = new CanvasNodeElt(this, elt);
        this.nodes.push(node);
        this.updateConnectors(this.connectors);
        return node;
    }

    getNodes() {
        return this.nodes;
    }

    getNodeFromElementId(id: string) {
        return this.nodes.find(node => node.id() === id);
    }

    removeNode(node: CanvasNodeElt) {        
        this.nodes = this.nodes.filter(elt => elt !== node);
        this.connectors = this.connectors.filter(
            connector => connector.getSrc().node() !== node && connector.getDst().node() !== node);
        this.updateConnectors(this.connectors);
    }

    removeNodeFromElement(elt: HTMLElement) {
        const node = this.nodes.find(node => node.getElement() === elt);
        if(node) {
            this.removeNode(node);
        }
    }

    updateConnectors(connectors: Connector[]) {        
        this.clearSVGConnectors();
        this.connectors = connectors;
        this.buildSVGConnectors();
    }

    getBlockFromId(blockId: BlockId): CanvasBlockElt {
        const node = this.nodes.find(elt => elt.id() === blockId.nodeId);
        return node.getBlockFromId(blockId.blockId);
    }

    getContainer() {
        return this.canvasContainer;
    }

    getNodesContainer() {
        return this.nodesContainer;
    }

    getSVGContainer() {
        return this.svgContainer;
    }

    getStyle() {
        return this.style;
    }

    applyAutoLayout(autoLayout: AutoLayout) {
        autoLayout.autoLayout(this);        
    }

    private retrieveNodesContainer() {
        this.nodesContainer = HTMLUtils.findFirstChildWithClass(
            this.canvasContainer,
            CanvasIds.getCanvasNodesClassName());
        if (!this.nodesContainer) {
            throw new Error(`Missing nodes elements with class ${CanvasIds.getCanvasNodesClassName()}`);
        }
    }

    private initCanvasNodesContainer() {
        this.retrieveNodesContainer();
        this.initContainerNodesStyle(this.nodesContainer, this.style);
        this.initSVG(this.nodesContainer, this.style);
    }

    private initContainerNodesStyle(root: HTMLElement, style: Style) {
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
        const groupElement = style.createConnectorsGroupElement();
        container.appendChild(groupElement);
        root.appendChild(container);

        this.svgContainer = container;
        this.connectorsContainer = groupElement;
    }

    private clearSVGConnectors() {
        SVG.clearPaths(this.connectorsContainer);
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
            this.connectorsContainer.appendChild(path);
        }
    }

    private initEventListeners() {
        document.addEventListener(CE_CANVAS_DRAGGED, () => {
            this.updateConnectors(this.connectors);
        });
        document.addEventListener(CE_CANVAS_TRANSFORMED,
            (evt: CustomEvent<CustomTransformEvent>) => {                
                this.transform = evt.detail.transform;
                this.updateConnectors(this.connectors);
            });
        document.addEventListener(CE_CANVAS_CREATE_CONNECTOR_END,
            (evt: CustomEvent<CustomCreateConnectorEvent>) => {
                if (evt.detail.connector) {
                    this.connectors.push(evt.detail.connector);
                    this.updateConnectors(this.connectors);
                }
            });
        document.addEventListener(CE_CANVAS_UPDATE_CONNECTORS,
            (evt: CustomEvent<CustomUpdateConnectorsEvent>) => {
                this.updateConnectors(this.connectors);
            });        
    }

    private initCanvasNodes() {
        for (let child of Array.from(this.nodesContainer.getElementsByClassName(CanvasIds.getCanvasNodeClassName()))) {
            if (child instanceof HTMLElement) {
                this.nodes.push(new CanvasNodeElt(this, child));
            }
        }
    }

    private createActions() {
        new TranslateAction(this, TransformEvent.forCanvas(this));
        new ScaleAction(this, TransformEvent.forCanvas(this));
    }
}
