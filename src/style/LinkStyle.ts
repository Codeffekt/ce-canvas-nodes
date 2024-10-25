
export interface LinkStyleFactory {
    [key:string]: LinkStyle;
}

export interface LinkStyle {
    applySVGPathStyle(path: SVGPathElement): void;
    getLinkStyleName(): string;    
}