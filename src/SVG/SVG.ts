import { CanvasIds } from "../canvas/CanvasIds";
import { Style } from "../style/Style";

export interface SVGPoint {
    x: number;
    y: number;
}

export class SVG {

    static createDefs() {
        const defsElement = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        return defsElement;
    }

    static createContainer(style: Style) {
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        style.applyRootStyle(svgElement);
        return svgElement;
    }

    static clearPaths(svgElement: SVGElement) {
        const paths = svgElement.getElementsByTagNameNS("http://www.w3.org/2000/svg", "path");
        for (let i = 0; i < paths.length; ++i) {
            svgElement.removeChild(paths[i]);
        }
    }

    static createPath(src: HTMLElement, dst: HTMLElement, id: string, style: Style) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        style.applySVGPathStyle(path);
        path.setAttributeNS(null, "id", id);

        const frontPoint = this.getCenterPoint(dst);
        const backPoint = this.getCenterPoint(src);

        const isConnectorLeftToRight = frontPoint.x > backPoint.x;

        const delta = isConnectorLeftToRight ? -200 : 200;

        const controlFront: SVGPoint = {
            x: frontPoint.x + delta,
            y: frontPoint.y
        };
        const controlBack: SVGPoint = {
            x: backPoint.x - delta,
            y: backPoint.y
        };

        const deltaArrow = isConnectorLeftToRight ? -10 : 10;

        const d = "M" + (frontPoint.x + deltaArrow) + " " + frontPoint.y + " " + "C " + controlFront.x + " " + controlFront.y + " " + controlBack.x + " " + controlBack.y + " " + backPoint.x + " " + backPoint.y;
        path.setAttributeNS(null, "d", d);
        path.setAttributeNS(null, "marker-start", "url(#" + CanvasIds.forArrowType('arrow') + ")");

        return path;
    }

    static getCenterPoint(src: HTMLElement): SVGPoint {
        const rect = src.getBoundingClientRect();
        return {
            x: (rect.left + rect.right) / 2,
            y: (rect.top + rect.bottom) / 2,
        };
    }
}