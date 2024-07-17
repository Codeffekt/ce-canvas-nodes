import { GroupElementStyle } from "../style";

export class GroupElement {

    static createElementFromStyle(style: GroupElementStyle) {
        const gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gElement.id = style.id;
        gElement.setAttribute("fill", style.fill);
        gElement.setAttribute("stroke", style.stroke);
        gElement.setAttribute("stroke-width", style["stroke-width"]);
        return gElement;
    }

}