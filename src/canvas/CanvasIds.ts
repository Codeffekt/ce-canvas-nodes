import { Connector } from "./Connector";

export class CanvasIds {    

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
    
}