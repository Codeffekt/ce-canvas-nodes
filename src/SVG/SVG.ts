import { CanvasTransform } from "../canvas";
import { CanvasIds } from "../canvas/CanvasIds";
import { Style } from "../style/Style";

export interface SVGPoint {
    x: number;
    y: number;
}

export interface SVGPointPair {
    a: SVGPoint;
    b: SVGPoint;
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
        while (svgElement.firstElementChild) {
            svgElement.firstElementChild.remove();
        }        
    }

    static createPath(frontPoint: SVGPoint, backPoint: SVGPoint, id: string, style: Style) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        style.applySVGPathStyle(path);
        path.setAttributeNS(null, "id", id);
        this.updatePath(path, frontPoint, backPoint);
        path.setAttributeNS(null, "marker-start", "url(#" + CanvasIds.forArrowType('arrow') + ")");
        return path;
    }

    static updatePath(path: SVGPathElement, frontPoint: SVGPoint, backPoint: SVGPoint) {
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
    }

    static getCenterPoint(src: HTMLElement): SVGPoint {
        const rect = src.getBoundingClientRect();
        return {
            x: (rect.left + rect.right) / 2,
            y: (rect.top + rect.bottom) / 2,
        };
    }

    static getXDistance(a: SVGPoint, b: SVGPoint) {
        return Math.abs(a.x - b.x);
    }

    static translatePointFromRect(point: SVGPoint, rect: DOMRect): SVGPoint {
        return {
            x: point.x - rect.x,
            y: point.y - rect.y
        };
    }

    static transformPoint(point: SVGPoint, transform: CanvasTransform): SVGPoint {
        return {
            x: point.x * transform.scale - transform.translation.tx,
            y: point.y * transform.scale - transform.translation.ty,
        };
    }
}