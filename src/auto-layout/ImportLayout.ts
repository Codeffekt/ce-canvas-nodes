import { Canvas } from "../canvas";
import { CSS } from "../CSS";
import { DragEvent } from "../events";
import { CanvasLayoutConfig } from "../format";
import { CoordsUtils } from "../utils";
import { AutoLayout, AutoLayoutConfig } from "./AutoLayout";

export class ImportLayout implements AutoLayout {

    constructor(private format: CanvasLayoutConfig) {
    }

    autoLayout(canvas: Canvas, config?: AutoLayoutConfig) {

        const existingNodes = this.format.nodes
            .map(nodeLayout => ({
                canvasNode: canvas.getNodeFromElementId(nodeLayout.id),
                nodeLayout,
            }))
            .filter(elt => elt.canvasNode);

        for (const node of existingNodes) {            
            node.canvasNode.setCoords(node.nodeLayout.coords);
        }

        if (existingNodes.length) {
            const provider = DragEvent.forCanvasNodeElts(
                existingNodes.map(elt => elt.canvasNode)
            );

            if (!config?.doNotRaiseEvents) {
                provider.onElementDragged();
                provider.onElementEndDragging();
            } else {
                canvas.updateConnectors();
            }
        }
    }

}