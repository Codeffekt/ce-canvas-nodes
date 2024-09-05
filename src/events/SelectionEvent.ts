import { CanvasBlockElt } from "../canvas";

export const CE_CANVAS_SELECTION = "ce-canvas-selection";
export const CE_CANVAS_SELECTION_ENTER = "ce-canvas-selection-enter";
export const CE_CANVAS_SELECTION_LEAVE = "ce-canvas-selection-leave";

export interface CustomSelectionEvent {
    type: "canvas-block-elt",
    elt: CanvasBlockElt
}

export interface SelectionEventProvider {

    onElementStartSelection();
    onElementSelectionEnter();
    onElementSelectionLeave();

}

export class SelectionEvent {

    static forCanvasBlock(elt: CanvasBlockElt): SelectionEventProvider {
        return {
            onElementStartSelection: () => {
                const evt = new CustomEvent<CustomSelectionEvent>(CE_CANVAS_SELECTION, {
                    detail: {
                        type: "canvas-block-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementSelectionEnter: () => {
                const evt = new CustomEvent<CustomSelectionEvent>(CE_CANVAS_SELECTION_ENTER, {
                    detail: {
                        type: "canvas-block-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementSelectionLeave: () => {
                const evt = new CustomEvent<CustomSelectionEvent>(CE_CANVAS_SELECTION_LEAVE, {
                    detail: {
                        type: "canvas-block-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            }
        };
    }

}

