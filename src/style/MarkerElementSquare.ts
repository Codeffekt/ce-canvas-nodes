import { MarkerElementStyle } from "./MarkerElementStyle";

export class MarkerElementSquare {

    static MARKER_ID = "ce_canvas_square";

    static create(style: MarkerElementStyle): SVGMarkerElement {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        element.setAttribute("id", style.id);
        element.setAttribute("markerWidth", "16");
        element.setAttribute("markerHeight", "16");
        element.setAttribute("refX", "5");
        element.setAttribute("refY", "5");
        element.setAttribute("markerUnits", "userSpaceOnUse");
        element.setAttribute("orient", "45");
        
        const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        square.setAttribute("fill", style.fill);
        square.setAttribute("class", style.class);
        square.setAttribute("stroke-width", style.strokeWidth);
        square.setAttribute("stroke", style.stroke);
        square.setAttribute("width", "10");
        square.setAttribute("height", "10");
         
        element.appendChild(square);

        return element;
    }
}