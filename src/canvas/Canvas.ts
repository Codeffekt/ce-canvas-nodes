import { TranslateAction } from "../actions";
import { ScaleAction } from "../actions/ScaleAction";
import { AutoLayout } from "../auto-layout";
import { DisposeInterface } from "../core";
import { CE_CANVAS_DRAGGED, CE_CANVAS_UPDATE_CONNECTORS, CustomUpdateConnectorsEvent } from "../events";
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

export class Canvas implements DisposeInterface {

    private nodesContainer: HTMLElement;
    private svgContainer: SVGElement;
    private connectorsContainer: SVGElement;
    private connectors: Connector[] = [];
    private nodes: CanvasNodeElt[] = [];
    private observer: MutationObserver;
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
        this.initConnectors();
        this.buildSVGConnectors();
        this.initEventListeners();
        this.createObserver();
        this.createActions();
    }

    dispose() {
        this.observer.disconnect();
        this.clearSVGConnectors();
        for(const node of this.nodes) {
            node.dispose();
        }
        this.nodes = [];
        this.connectors = [];        
    }

    addNodeFromElement(elt: HTMLElement) {        
        const node = new CanvasNodeElt(this, elt);
        this.nodes.push(node);
        this.updateConnectors();
        return node;
    }

    getNodes() {
        return this.nodes;
    }

    getNodeFromElementId(id: string) {
        return this.nodes.find(node => node.id() === id);
    }

    getNodeFromElement(node: Node) {
        return this.nodes.find(elt => elt.getElement() === node);
    }

    removeNode(node: CanvasNodeElt) {
        this.nodes = this.nodes.filter(elt => elt !== node);
        this.connectors = this.connectors.filter(
            connector => connector.getSrc().node() !== node && connector.getDst().node() !== node);
        node.dispose();
        this.updateConnectors();
    }

    removeNodeFromElement(elt: HTMLElement) {
        const node = this.nodes.find(node => node.getElement() === elt);
        if (node) {
            this.removeNode(node);
        }
    }

    updateConnectors() {
        this.initConnectors();
        this;this.redrawConnectors();
    }

    redrawConnectors() {
        this.clearSVGConnectors();        
        this.buildSVGConnectors();
    }

    getBlockFromId(blockId: BlockId): CanvasBlockElt {
        const node = this.nodes.find(elt => elt.id() === blockId.nodeId);
        return node.getBlockFromId(blockId.blockId);
    }

    removeBlockFromId(blockId: BlockId): CanvasBlockElt | undefined {        
        const node = this.nodes.find(elt => elt.id() === blockId.nodeId);
        if (!node) {
            return undefined;
        }
        const block = node.removeBlockFromId(blockId.blockId);

        if (block) {
            this.connectors = this.connectors.filter(
                connector => connector.getSrcId() !== blockId.blockId && connector.getDstId() !== blockId.blockId
            );
            this.updateConnectors();
        }

        return block;
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

    getTransform() {
        return this.transform;
    }

    getScale() {
        return this.transform.scale;
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
            this.redrawConnectors();
        });
        document.addEventListener(CE_CANVAS_TRANSFORMED,
            (evt: CustomEvent<CustomTransformEvent>) => {
                this.transform = evt.detail.transform;
                this.redrawConnectors();
            });
        document.addEventListener(CE_CANVAS_UPDATE_CONNECTORS,
            (evt: CustomEvent<CustomUpdateConnectorsEvent>) => {
                this.updateConnectors();
            });
    }

    private initCanvasNodes() {
        for (let child of Array.from(this.nodesContainer.getElementsByClassName(CanvasIds.getCanvasNodeClassName()))) {
            if (child instanceof HTMLElement) {
                this.nodes.push(new CanvasNodeElt(this, child));
            }
        }
    }

    private initConnectors() {
        this.connectors = [];
        for(const node of this.nodes) {
            const blocks = node.getBlocks();
            for(const block of blocks) {
                if(block.getLink()) {
                    this.connectors.push(Connector.fromElementsId(
                        this,
                        block.createBlockId(),
                        block.getLink()
                    ));
                }
            }
        }
    }

    private observeNodeChanges(mutationList: MutationRecord[], observer) {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                this.removeNodesFromChanges(mutation.removedNodes);
                this.addNodesFromChanges(mutation.addedNodes);
            }
        }
    }

    private removeNodesFromChanges(nodeList: NodeList) {
        const nodesToBeRemoved = Array.from(nodeList)            
            .filter(node => node instanceof HTMLElement);
        for(const node of nodesToBeRemoved) {
            this.removeNodeFromElement(node);
        }
    }

    private addNodesFromChanges(nodeList: NodeList) {        
        const nodesToBeAdded = Array.from(nodeList)
            .filter(node => node instanceof HTMLElement)
            .filter(node => node.classList.contains(CanvasIds.getCanvasNodeClassName()))                    
            .filter(node => !this.getNodeFromElement(node));        
        for(const node of nodesToBeAdded) {
            this.addNodeFromElement(node);
        }
    }

    private createActions() {
        new TranslateAction(this, TransformEvent.forCanvas(this));
        new ScaleAction(this, TransformEvent.forCanvas(this));
    }

    private createObserver() {
        this.observer = new MutationObserver((mutationList, observer) => this.observeNodeChanges(mutationList, observer));
        this.observer.observe(this.nodesContainer, { attributes: false, childList: true, subtree: false });
    }
}
