import { MarkerElementStyle } from "../style/MarkerElementStyle";
import { PolygonElement } from "./PolygonElement";

export class MarkerElement {    

    static createElementFromStyle(style: MarkerElementStyle) {
        const markerElement = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        markerElement.setAttribute("id", style.id);
        markerElement.setAttribute("markerWidth", "10");
        markerElement.setAttribute("markerHeight", "20");
        markerElement.setAttribute("refX", "10");
        markerElement.setAttribute("refY", "10");
        markerElement.setAttribute("markerUnits", "userSpaceOnUse");
        markerElement.setAttribute("orient", "auto");

        const polygonElement = PolygonElement.createElementFromStyle(style);
        markerElement.appendChild(polygonElement);

        return markerElement;
    }
}