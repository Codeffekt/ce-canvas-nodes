import { CanvasNodeElt } from "../canvas/CanvasNodeElt";

export const CE_CANVAS_DRAGGED = "ce-canvas-dragged";
export const CE_CANVAS_START_DRAGGING = "ce-canvas-start-dragging";
export const CE_CANVAS_END_DRAGGING = "ce-canvas-end-dragging";

export interface CustomDragEvent {
    type: "canvas-node-elt",
    elts: CanvasNodeElt[]
}

export interface DragEventProvider {

    onElementStartDragging();
    onElementDragged();
    onElementEndDragging();

}

export class DragEvent {

    static forCanvasNodeElts(elts: CanvasNodeElt[]): DragEventProvider {
        return {
            onElementStartDragging: () => {
                const evt = new CustomEvent<CustomDragEvent>(CE_CANVAS_START_DRAGGING, {
                    detail: {
                        type: "canvas-node-elt",
                        elts
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementDragged: () => {
                const evt = new CustomEvent<CustomDragEvent>(CE_CANVAS_DRAGGED, {
                    detail: {
                        type: "canvas-node-elt",
                        elts
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementEndDragging: () => {
                const evt = new CustomEvent<CustomDragEvent>(CE_CANVAS_END_DRAGGING, {
                    detail: {
                        type: "canvas-node-elt",
                        elts
                    }
                });
                document.dispatchEvent(evt);
            }
        };
    }

}

