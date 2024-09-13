import { Canvas } from "../canvas";
import { Vector2 } from "../core";

export class CoordsUtils {

    static getElementCenterPositionInCanvasCoords(canvas: Canvas, elt: HTMLElement): Vector2 {
        const canvasEltRect = canvas.getNodesContainer().getBoundingClientRect();
        const eltRect = elt.getBoundingClientRect();
    
        const scale = canvas.getScale();
    
        const left = (eltRect.left - canvasEltRect.left) / scale;
        const top = (eltRect.top - canvasEltRect.top) / scale;
        const x = (left + (eltRect.width / scale));
        const y = (top + (eltRect.height / scale));
    
        return { x , y }; 
    }

    static getPointPositionInCanvasCoords(canvas: Canvas, point: Vector2): Vector2 {
        const canvasEltRect = canvas.getNodesContainer().getBoundingClientRect();        
            
        const scale = canvas.getScale();

        const x = (point.x - canvasEltRect.left) / scale;
        const y = (point.y - canvasEltRect.top) / scale;        

        return { x , y }; 
    }

    static applyScale(canvas: Canvas, value: Vector2): Vector2 {        
        const scale = canvas.getScale();
        return { x: value.x / scale, y: value.y / scale };
    }

    static getElementCoordsInCanvasCoordsNorm(canvas: Canvas, elt: HTMLElement): Vector2 {
        const scale =   canvas.getScale();
        const canvasEltRect = canvas.getNodesContainer().getBoundingClientRect();
        return {
            x: (elt.offsetLeft * scale) / canvasEltRect.width,
            y: (elt.offsetTop * scale) / canvasEltRect.height
        }; 
    }
}