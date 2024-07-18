import { Canvas } from "../canvas";

export const CE_CANVAS_SCALED = "ce-canvas-scaled";
export const CE_CANVAS_START_SCALING = "ce-canvas-start-scaling";
export const CE_CANVAS_END_SCALING = "ce-canvas-end-scaling";

export interface CustomScaleEvent {
    type: "canvas-root-elt",
    elt: Canvas
}

export interface ScaleEventProvider {

    onElementStartScaling();
    onElementScaled();
    onElementEndScaling();

}

export class ScaleEvent {

    static forCanvas(elt: Canvas): ScaleEventProvider {
        return {
            onElementStartScaling: () => {
                const evt = new CustomEvent<CustomScaleEvent>(CE_CANVAS_START_SCALING, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementScaled: () => {
                const evt = new CustomEvent<CustomScaleEvent>(CE_CANVAS_SCALED, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementEndScaling: () => {
                const evt = new CustomEvent<CustomScaleEvent>(CE_CANVAS_END_SCALING, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            }
        };
    }

}

