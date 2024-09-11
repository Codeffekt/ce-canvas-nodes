import { Canvas, CanvasBlockElt, CanvasIds, Connector } from "../canvas";
import { CE_CANVAS_SELECTION_ENTER, CE_CANVAS_SELECTION_LEAVE, CustomSelectionEvent } from "../events";
import { CreateConnectorEventProvider } from "../events/CreateConnectorEvent";
import { Style } from "../style";
import { PathBuilder, SVG, SVGPointPair } from "../SVG";
import { CoordsUtils } from "../utils/CoordsUtils";

export class CreateConnectorAction {

    private connectorPoints: SVGPointPair = {
        a: null,
        b: null,
    };
    private draftContainer: SVGElement;
    private draftPath: SVGPathElement;
    private style: Style;
    private canvas: Canvas;
    private selectionEnterRef: any;
    private selectionLeaveRef: any;
    private connectorIsOnBlock = false;
    private newConnector: Connector | null = null;

    constructor(
        private block: CanvasBlockElt,
        private evtProvider: CreateConnectorEventProvider,
    ) {
        this.style = block.node().getCanvas().getStyle();
        this.canvas = block.node().getCanvas();
        this.createEventListeners();
    }

    private createEventListeners() {
        for (const anchor of this.block.getAnchors()) {
            anchor.addEventListener("mousedown", (event: MouseEvent) => {
                this.onDragMouseDown(event);
            });
        }
    }

    onDragMouseDown(event: MouseEvent) {
        this.evtProvider.onCreateConnectorStart();
        event.preventDefault();
        event.stopPropagation();
        const target = CoordsUtils.getElementCenterPositionInCanvasCoords(
            this.canvas,
            event.target as HTMLElement
        );
        this.connectorPoints = {
            a: target,
            b: target,
        };
        document.onmouseup = () => this.closeCreateEvent();
        document.onmousemove = (event) => this.connectorMoved(event);
        this.selectionEnterRef = (evt: CustomEvent<CustomSelectionEvent>) => {
            const target = evt.detail.elt;
            if (target.node() !== this.block.node()) {
                this.connectorOnBlock(target);
            }
        };
        document.addEventListener(CE_CANVAS_SELECTION_ENTER, this.selectionEnterRef);
        this.selectionLeaveRef = () => {
            this.newConnector = null;
        };
        document.addEventListener(CE_CANVAS_SELECTION_LEAVE, this.selectionLeaveRef);
        this.createConnectorDraft();
    }

    private closeCreateEvent() {
        this.newConnector?.getSrc().updateLink(this.newConnector.getDst().createBlockId());
        this.evtProvider.onCreateConnectorEnd(this.newConnector);
        document.removeEventListener(CE_CANVAS_SELECTION_ENTER, this.selectionEnterRef);
        document.removeEventListener(CE_CANVAS_SELECTION_LEAVE, this.selectionLeaveRef);
        document.onmouseup = null;
        document.onmousemove = null;
        document.onmouseover = null;
        this.draftContainer.remove();
    }

    private connectorMoved(event: MouseEvent) {
        if (this.newConnector) {
            return false;
        }

        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        this.connectorPoints.b = CoordsUtils.getPointPositionInCanvasCoords(this.canvas, { x, y });
        this.evtProvider.onCreateConnectorMoved();
        this.updateConnectorDraft();
    }

    private createConnectorDraft() {

        this.draftContainer = this.style.createDraftGroupElement();

        const id = CanvasIds.forConnectorDraft();
        this.draftPath = SVG.createPath(
            this.connectorPoints.a,
            this.connectorPoints.b,
            id,
            this.style
        );

        this.draftContainer.appendChild(this.draftPath);

        this.canvas.getSVGContainer().appendChild(this.draftContainer);
    }

    private connectorOnBlock(dstBlock: CanvasBlockElt) {
        this.newConnector = new Connector(this.block, dstBlock);
        const anchorPair = PathBuilder.findBestAnchorPoints(
            this.canvas,
            this.block,
            dstBlock
        );
        this.connectorPoints = anchorPair;
        this.updateConnectorDraft();
    }

    private updateConnectorDraft() {
        SVG.updatePath(this.draftPath, this.connectorPoints.a, this.connectorPoints.b);
    }
}