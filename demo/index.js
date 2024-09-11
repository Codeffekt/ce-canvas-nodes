import { BlockIdUtils, Canvas, Connector, SingleRowAutoLayout, ZoomToFit } from '../dist/ce-canvas-nodes.esm.js';

function applyAutoLayout(canvas) {
    canvas.applyAutoLayout(new SingleRowAutoLayout());
}

function zoomToFit(canvas) {
    canvas.applyAutoLayout(new ZoomToFit());
}

function addLink(canvas, src, dst) {
    const block = canvas.getBlockFromId(src);
    if(block) {
        block.nativeElement().setAttribute(Connector.ATTRIBUTE_NAME, BlockIdUtils.createLink(dst));
    }
}

function updateLink(canvas, src, dst) {
    addLink(canvas, src, dst);
}

function removeBlock(canvas, blockId) {
    const block = canvas.getBlockFromId(blockId);
    if(block) {
        block.nativeElement().remove();
    }
}

function bootstrap() {

    const root = document.getElementById("canvas");

    if (!root) {
        throw new Error("Missing container with canvas id");
    }

    const canvas = new Canvas(root);    
    
    document.querySelector('#autoLayout').addEventListener('click', () => applyAutoLayout(canvas));
    document.querySelector('#zoomToFit').addEventListener('click', () => zoomToFit(canvas));
    document.querySelector('#removeBlock').addEventListener('click', () => removeBlock(canvas, { nodeId: "elt2", blockId: "block2" }));
    document.querySelector('#addLink').addEventListener('click', () => addLink(canvas, 
        { nodeId: "elt1", blockId: "block2" },
        { nodeId: "elt2", blockId: "block1"})
    );
    document.querySelector('#updateLink').addEventListener('click', () => updateLink(canvas, 
        { nodeId: "elt1", blockId: "header"},
        { nodeId: "elt3", blockId: "header" })
    );
}

bootstrap();