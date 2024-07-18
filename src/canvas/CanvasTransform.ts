export interface CanvasTranslation {
    tx: number;
    ty: number;
}

export interface CanvasTransform {
    translation: CanvasTranslation;
    scale: number;
}