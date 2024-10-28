import { CanvasIds } from "../canvas";
import { GroupElement } from "../SVG";
import { LinkStyle, LinkStyleFactory } from "./LinkStyle";
import { LinkStyleArrow } from "./LinkStyleArrow";
import { LinkStyleSquare } from "./LinkStyleSquare";
import { Markers } from "./Markers";

export class Style {

    private svgContainerId = "ce_canvas_svgContainer";
    private svgConnectorsId = "ce_canvas_svgConnectors";

    private classes = {
        "connector_selected": "ce_canvas_connector_selected",
        "input_block": "ce_canvas_input_block",
        "connectable": "ce_canvas_connectable",
        "connector": "ce_canvas_connector",
        "connector_over": "ce_canvas_connector_over",
        "path": "ce_canvas_path",
        "connector_draft": "ce_canvas_connector_draft",
    };

    private colors = {
        "fill": "#ffffff",
        "fill-draft": "#898E99",
        "fill-over": "#898E99",
        "fill-selected": "#898E99",
        "stroke": "#898E99",
        "stroke-draft": "#898E99",
        "stroke-over": "#898E99",
        "stroke-selected": "#898E99",        
    };

    private linkStyleFactory: LinkStyleFactory = {
        [LinkStyleArrow.LINK_STYLE_NAME]: new LinkStyleArrow(),
        [LinkStyleSquare.LINK_STYLE_NAME]: new LinkStyleSquare(),
    };

    private defaultLinkStyle = LinkStyleArrow.LINK_STYLE_NAME;

    constructor() {

    }

    getLinkStyle(linkStyle: string): LinkStyle {
        return this.linkStyleFactory[linkStyle] ?? this.linkStyleFactory[this.defaultLinkStyle];
    }

    getColor(id: string) {
        return this.colors[id];
    }

    getClass(id: string) {
        return this.classes[id];
    }

    getStrokeWidth() {
        return "2";
    }

    applyRootStyle(root: HTMLElement|SVGElement) {
        root.style.overflow = "visible";
        root.style.left = "0px";
        root.style.top = "0px";
        root.style.position = "absolute";
        root.style.zIndex = "inherit";
    }

    applySVGRootStyle(root: SVGSVGElement) {
        root.style.overflow = "visible";
        root.style.left = "0px";
        root.style.top = "0px";
        root.style.position = "absolute";
        root.style.pointerEvents = "none";
    }

    createMarkerElements(): SVGMarkerElement[] {
        return Markers.createMarkerElements(this);
    }

    createConnectorsGroupElement() {
        return GroupElement.createElementFromStyle({
            id: this.getSVGConnectorsId(),
            fill: "white",
            stroke: this.getColor("stroke"),
            "stroke-width": this.getStrokeWidth(),
        });
    }

    createDraftGroupElement() {
        return GroupElement.createElementFromStyle({
            id: CanvasIds.forDraftGroup(),
            fill: "white",
            stroke: this.getColor("stroke"),
            "stroke-width": this.getStrokeWidth(),
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