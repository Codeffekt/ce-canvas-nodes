import { Canvas } from "../canvas";

export interface AutoLayoutConfig {
    doNotRaiseEvents?: boolean;
}

export interface AutoLayout {
    autoLayout(canvas: Canvas, config?: AutoLayoutConfig);
}