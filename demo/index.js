import { Canvas, Connector, SingleRowAutoLayout } from '../dist/ce-canvas-nodes.esm.js';

var canvas = undefined;

export default function applyAutoLayout() {
    canvas.applyAutoLayout(new SingleRowAutoLayout());
}

function bootstrap() {

    const root = document.getElementById("canvas");

    if (!root) {
        throw new Error("Missing container with canvas id");
    }

    canvas = new Canvas(root);
    canvas.updateConnectors([
        Connector.fromElementsId(canvas, {
            nodeId: "elt1",
            blockId: "header"
        }, {
            nodeId: "elt2",
            blockId: "block1"
        })
    ]);  
    
    document.querySelector('#autoLayout').addEventListener('click', applyAutoLayout)
}

bootstrap();