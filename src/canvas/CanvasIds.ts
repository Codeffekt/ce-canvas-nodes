import { Connector } from "./Connector";

const arrow_ids = {
    "arrow": "tds_arrow",
    "arrow_draft": "tds_arrow_draft",
    "arrow_over": "tds_arrow_over",
    "arrow_selected": "tds_arrow_selected"
};

export class CanvasIds {

    static getLeftAnchorId() {
        return "left-anchor";
    }

    static getRightAnchorId() {
        return "right-anchor";
    }

    static getAnchorClassName() {
        return "canvas-anchor";
    }    

    static getCanvasNodesClassName() {
        return "canvas-nodes";
    }

    static getCanvasNodeClassName() {
        return "canvas-node-elt";
    }

    static getCanvasBlockClassName() {
        return "canvas-block-elt";
    }

    static getClassDraggable() {
        return "canvas-elt-draggable";
    }

    static forConnector(connector: Connector) {
        return `connector/${connector.getSrcId()}/${connector.getDstId()}`;
    }

    static forDraftGroup() {
        return "canvas-draft-group";
    }

    static forConnectorDraft() {
        return "canvas-connector-draft";
    }

    static forArrowType(type: string) {
        return arrow_ids[type];
    }
}