import { Canvas, CanvasTransform } from "../canvas";

export const CE_CANVAS_TRANSFORMED = "ce-canvas-transformed";
export const CE_CANVAS_START_TRANSFORM = "ce-canvas-start-transform";
export const CE_CANVAS_END_TRANSFORM = "ce-canvas-end-transform";

export interface CustomTransformEvent {
    type: "canvas-root-elt",
    elt: Canvas,
    transform: CanvasTransform,
}

export interface TransformEventProvider {

    onElementStartTransform(transform: CanvasTransform);
    onElementTransform(transform: CanvasTransform);
    onElementEndTransform(transform: CanvasTransform);

}

export class TransformEvent {

    static forCanvas(elt: Canvas): TransformEventProvider {
        return {
            onElementStartTransform: (transform: CanvasTransform) => {
                const evt = new CustomEvent<CustomTransformEvent>(CE_CANVAS_START_TRANSFORM, {
                    detail: {
                        type: "canvas-root-elt",
                        elt,
                        transform,                
                    },                    
                });
                document.dispatchEvent(evt);
            },
            onElementTransform: (transform: CanvasTransform) => {
                const evt = new CustomEvent<CustomTransformEvent>(CE_CANVAS_TRANSFORMED, {
                    detail: {
                        type: "canvas-root-elt",
                        elt,
                        transform,                        
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementEndTransform: (transform: CanvasTransform) => {
                const evt = new CustomEvent<CustomTransformEvent>(CE_CANVAS_END_TRANSFORM, {
                    detail: {
                        type: "canvas-root-elt",
                        elt,
                        transform,
                    }
                });
                document.dispatchEvent(evt);
            }
        };
    }

}

