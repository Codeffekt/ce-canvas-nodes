import { Canvas } from "../canvas";

export const CE_CANVAS_TRANSLATED = "ce-canvas-translated";
export const CE_CANVAS_START_TRANSLATION = "ce-canvas-start-translation";
export const CE_CANVAS_END_TRANSLATION = "ce-canvas-end-translation";

export interface CustomTranslateEvent {
    type: "canvas-root-elt",
    elt: Canvas
}

export interface TranslateEventProvider {

    onElementStartTranslation();
    onElementTranslated();
    onElementEndTranslation();

}

export class TranslateEvent {

    static forCanvas(elt: Canvas): TranslateEventProvider {
        return {
            onElementStartTranslation: () => {
                const evt = new CustomEvent<CustomTranslateEvent>(CE_CANVAS_START_TRANSLATION, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementTranslated: () => {
                const evt = new CustomEvent<CustomTranslateEvent>(CE_CANVAS_TRANSLATED, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onElementEndTranslation: () => {
                const evt = new CustomEvent<CustomTranslateEvent>(CE_CANVAS_END_TRANSLATION, {
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

