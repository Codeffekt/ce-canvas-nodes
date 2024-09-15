import { Canvas } from "../canvas";
import { CSS } from "../CSS";
import { CanvasLayoutConfig } from "../format";
import { CoordsUtils } from "../utils";
import { AutoLayout } from "./AutoLayout";

export class ImportLayout implements AutoLayout {

    constructor(private format: CanvasLayoutConfig) {

    }

    autoLayout(canvas: Canvas) {
        CSS.applyTransformOnStyle(canvas.getNodesContainer(), this.format.transform);
        for (const nodeLayout of this.format.nodes) {
            const node = canvas.getNodeFromElementId(nodeLayout.id);
            if (node) {
                const offset = CoordsUtils.canvasCoordsNormToOffset(
                    canvas,
                    nodeLayout.coords,
                )
                CSS.setEltUpperLeftPos(
                    node.getElement(),
                    offset.x,
                    offset.y
                );
            }
        }
        CSS.applyTransformOnStyle(canvas.getNodesContainer(), this.format.transform);
    }

}