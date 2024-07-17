import { Canvas, Connector } from '../dist/ce-canvas-nodes.esm.js';

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
}

bootstrap();