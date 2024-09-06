import { Canvas, Connector, SingleRowAutoLayout, ZoomToFit } from '../dist/ce-canvas-nodes.esm.js';

function applyAutoLayout(canvas) {
    canvas.applyAutoLayout(new SingleRowAutoLayout());
}

function zoomToFit(canvas) {
    canvas.applyAutoLayout(new ZoomToFit());
}

function bootstrap() {

    const root = document.getElementById("canvas");

    if (!root) {
        throw new Error("Missing container with canvas id");
    }

    const canvas = new Canvas(root);
    canvas.updateConnectors([
        Connector.fromElementsId(canvas, {
            nodeId: "elt1",
            blockId: "header"
        }, {
            nodeId: "elt2",
            blockId: "block1"
        })
    ]);  
    
    document.querySelector('#autoLayout').addEventListener('click', () => applyAutoLayout(canvas));
    document.querySelector('#zoomToFit').addEventListener('click', () => zoomToFit(canvas));
}

bootstrap();