import { MarkerElementStyle } from "./MarkerElementStyle";

export class MarkerElementCircle {

    static MARKER_ID = "ce_canvas_circle";

    static create(style: MarkerElementStyle): SVGMarkerElement {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        element.setAttribute("id", style.id);
        element.setAttribute("markerWidth", "16");
        element.setAttribute("markerHeight", "16");
        element.setAttribute("refX", "8");
        element.setAttribute("refY", "8");
        element.setAttribute("markerUnits", "userSpaceOnUse");
        element.setAttribute("orient", "auto");
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("fill", style.fill);
        circle.setAttribute("class", style.class);
        circle.setAttribute("stroke-width", style.strokeWidth);
        circle.setAttribute("stroke", style.stroke);
        circle.setAttribute("r", "6");
        circle.setAttribute("cx", "8");
        circle.setAttribute("cy", "8");        
         
        element.appendChild(circle);

        return element;
    }

}