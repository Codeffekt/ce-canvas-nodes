import { Canvas } from "../canvas";
import { SVGPoint } from "../SVG";

export class CoordsUtils {

    static getElementCenterPositionInCanvasCoords(canvas: Canvas, elt: HTMLElement): SVGPoint {
        const canvasEltRect = canvas.getCanvasElt().getBoundingClientRect();
        const eltRect = elt.getBoundingClientRect();
    
        const scale = canvasEltRect.width / canvas.getCanvasElt().clientWidth;
    
        const left = (eltRect.left - canvasEltRect.left) / scale;
        const top = (eltRect.top - canvasEltRect.top) / scale;
        const x = (left + (eltRect.width / scale));
        const y = (top + (eltRect.height / scale));
    
        return { x , y }; 
    }

    static getPointPositionInCanvasCoords(canvas: Canvas, point: SVGPoint): SVGPoint {
        const canvasEltRect = canvas.getCanvasElt().getBoundingClientRect();        
    
        const scale = canvasEltRect.width / canvas.getCanvasElt().clientWidth;

        const x = (point.x - canvasEltRect.left) / scale;
        const y = (point.y - canvasEltRect.top) / scale;        

        return { x , y }; 
    }

    static applyScale(canvas: Canvas, value: number) {
        const scale = canvas.getCanvasElt().getBoundingClientRect().width / canvas.getCanvasElt().clientWidth;
        return value / scale;
    }
}