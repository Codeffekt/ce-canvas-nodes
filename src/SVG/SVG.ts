import { CanvasTransform } from "../canvas";
import { LinkStyle } from "../style";
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
        style.applySVGRootStyle(svgElement);
        return svgElement;
    }

    static clearPaths(svgElement: SVGElement) {
        while (svgElement.firstElementChild) {
            svgElement.firstElementChild.remove();
        }        
    }

    static createPath(backPoint: SVGPoint, frontPoint: SVGPoint, id: string, style: LinkStyle) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        style.applySVGPathStyle(path);
        path.setAttributeNS(null, "id", id);
        this.updatePath(path, backPoint, frontPoint);        
        return path;
    }

    static updatePath(path: SVGPathElement, backPoint: SVGPoint, frontPoint: SVGPoint) {
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

        const d = "M" + frontPoint.x + " " + frontPoint.y + " " + 
            "C " + controlFront.x + " " + controlFront.y + " " + 
            controlBack.x + " " + controlBack.y + " " + backPoint.x + " " + backPoint.y;
            
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