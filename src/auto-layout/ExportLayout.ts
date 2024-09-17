import { Canvas } from "../canvas";
import { CanvasLayoutConfig } from "../format";
import { AutoLayout } from "./AutoLayout";

export class ExportLayout implements AutoLayout {    

    private layout?: CanvasLayoutConfig;

    constructor() {
    }

    getExportedLayout() {
        return this.layout;
    }

    autoLayout(canvas: Canvas) {
        
        const nodes = canvas.getNodes();

        const layout: CanvasLayoutConfig = {            
            nodes: nodes.map((node) => ({
                id: node.id(),
                coords: node.getCoords(),
            }))
        };

        this.layout = layout;
    }
}