import { Canvas } from "../canvas";

export const CE_CANVAS_UPDATE_CONNECTORS = "ce-canvas-update-connectors";

export interface CustomUpdateConnectorsEvent {
    type: "canvas-root-elt",
    elt: Canvas,
}

export interface UpdateConnectorsEventProvider {
    onUpdateConnectors();
}

export class UpdateConnectorsEvent {

    static forCanvas(elt: Canvas): UpdateConnectorsEventProvider {
        return {
            onUpdateConnectors: () => {
                const evt = new CustomEvent<CustomUpdateConnectorsEvent>(CE_CANVAS_UPDATE_CONNECTORS, {
                    detail: {
                        type: "canvas-root-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            }
        }
    }

}