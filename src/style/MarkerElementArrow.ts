import { MarkerElementStyle } from "./MarkerElementStyle";

export class MarkerElementArrow {

    static MARKER_ID = "ce_canvas_arrow";

    static create(style: MarkerElementStyle): SVGMarkerElement {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        element.setAttribute("id", style.id);
        element.setAttribute("markerWidth", "12");
        element.setAttribute("markerHeight", "20");
        element.setAttribute("refX", "6");
        element.setAttribute("refY", "10");
        element.setAttribute("markerUnits", "userSpaceOnUse");
        element.setAttribute("orient", "auto");
        
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        arrow.setAttribute("fill", style.fill);
        arrow.setAttribute("class", style.class);
        arrow.setAttribute("stroke-width", style.strokeWidth);
        arrow.setAttribute("stroke", style.stroke);
        arrow.setAttribute("points", "12 4, 12 16, 2 10");
         
        element.appendChild(arrow);

        return element;
    }

}