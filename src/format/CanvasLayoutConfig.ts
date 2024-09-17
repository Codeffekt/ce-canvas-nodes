import { Vector2 } from "../core";

export interface CanvasNodeLayoutConfig {
    id: string;
    coords: Vector2;
}

export interface CanvasLayoutConfig {    
    nodes: CanvasNodeLayoutConfig[];
}