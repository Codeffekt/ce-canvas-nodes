import { CanvasIds } from "../canvas";
import { GroupElement } from "../SVG";
import { MarkerElement } from "../SVG/MarkerElement";
import { MarkerElementStyle } from "./MarkerElementStyle";

export class Style {

    private svgContainerId = "tds_svgContainer";
    private svgConnectorsId = "tds_svgConnectors";

    private classes = {
        "connector_selected": "tds_connector_selected",
        "input_block": "tds_input_block",
        "connectable": "tds_connectable",
        "connector": "tds_connector",
        "connector_over": "tds_connector_over",
        "path": "tds_path",
        "connector_draft": "tds_connector_draft",
    };

    private colors = {
        "black": "black",
        "gray": "gray",
        "blue": "#3ea9f5"
    };

    constructor() {

    }

    applyRootStyle(root: HTMLElement|SVGElement) {
        root.style.overflow = "visible";
        root.style.left = "0px";
        root.style.top = "0px";
        root.style.position = "absolute";
        root.style.zIndex = "inherit";
    }

    createMarkerElements(): SVGMarkerElement[] {
        const markerElementStyles: MarkerElementStyle[] = [
            { id: CanvasIds.forArrowType('arrow'), fill: this.colors['black'], class: this.classes['connector'] },
            { id: CanvasIds.forArrowType('arrow_draft'), fill: this.colors['gray'], class: this.classes['connector_draft'] },
            { id: CanvasIds.forArrowType('arrow_over'), fill: this.colors['gray'], class: this.classes['connector_over'] },
            { id: CanvasIds.forArrowType('arrow_selected'), fill: this.colors['blue'], class: this.classes['connector_selected'] }
        ];
        return markerElementStyles
            .map(markerElementStyle => MarkerElement.createElementFromStyle(markerElementStyle));
    }

    createConnectorsGroupElement() {
        return GroupElement.createElementFromStyle({
            id: this.getSVGConnectorsId(),
            fill: "white",
            stroke: "black",
            "stroke-width": "2",
        });
    }

    createDraftGroupElement() {
        return GroupElement.createElementFromStyle({
            id: CanvasIds.forDraftGroup(),
            fill: "white",
            stroke: "black",
            "stroke-width": "2",
        });
    }

    getSVGContainerId() {
        return this.svgContainerId;
    }

    getSVGConnectorsId() {
        return this.svgConnectorsId;
    }

    applySVGPathStyle(path: SVGPathElement) {
        path.setAttributeNS(null, "fill", "transparent");
        path.setAttributeNS(null, "class", "connector");
        path.setAttributeNS(null, "pointer-events", "stroke");
    }
}