import { MarkerElementStyle } from "../style/MarkerElementStyle";

export class PolygonElement {

    static createElementFromStyle(marker: MarkerElementStyle) {
        const polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygonElement.setAttribute("fill", marker.fill);
        polygonElement.setAttribute("class", marker.class);
        polygonElement.setAttribute("points", "10 6, 10 14, 2 10");
        return polygonElement;
    }

}