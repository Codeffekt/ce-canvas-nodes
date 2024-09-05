import { Connector } from "../canvas";
import { CanvasBlockElt } from "../canvas/CanvasBlockElt";

export const CE_CANVAS_CREATE_CONNECTOR_START = "ce-canvas-create-connector-start";
export const CE_CANVAS_CREATE_CONNECTOR_MOVED = "ce-canvas-create-connector-moved";
export const CE_CANVAS_CREATE_CONNECTOR_END = "ce-canvas-create-connector-end";

export interface CustomCreateConnectorEvent {
    type: "canvas-block-elt",
    elt: CanvasBlockElt,
    connector?: Connector;
}

export interface CreateConnectorEventProvider {

    onCreateConnectorStart();
    onCreateConnectorMoved();
    onCreateConnectorEnd(connector?: Connector);

}

export class CreateConnectorEvent {

    static forCanvasBlockElt(elt: CanvasBlockElt): CreateConnectorEventProvider {
        return {
            onCreateConnectorStart: () => {
                const evt = new CustomEvent<CustomCreateConnectorEvent>(CE_CANVAS_CREATE_CONNECTOR_MOVED, {
                    detail: {
                        type: "canvas-block-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onCreateConnectorMoved: () => {
                const evt = new CustomEvent<CustomCreateConnectorEvent>(CE_CANVAS_CREATE_CONNECTOR_START, {
                    detail: {
                        type: "canvas-block-elt",
                        elt
                    }
                });
                document.dispatchEvent(evt);
            },
            onCreateConnectorEnd: (connector?: Connector) => {
                const evt = new CustomEvent<CustomCreateConnectorEvent>(CE_CANVAS_CREATE_CONNECTOR_END, {
                    detail: {
                        type: "canvas-block-elt",
                        elt,
                        connector,
                    }
                });
                document.dispatchEvent(evt);
            }
        };
    }

}

