import { BlockIdUtils, Canvas, CenterElts, Connector, SingleRowAutoLayout, ZoomToFit } from '../dist/ce-canvas-nodes.esm.js';

function domify (str) {
    const el = document.createElement('div');
    el.innerHTML = str;
  
    const frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  }

function applyAutoLayout(canvas) {
    canvas.applyAutoLayout(new SingleRowAutoLayout());
}

function zoomToFit(canvas) {
    canvas.applyAutoLayout(new ZoomToFit());
}

function centerElts(canvas) {
    canvas.applyAutoLayout(new CenterElts());
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

function removeNode(canvas, nodeId) {
    const node = canvas.getNodeFromElementId(nodeId);
    if(node) {
        node.getElement().remove();
    }
}

function importLayout(canvas) {
    
}

function addNode(canvas) {
    const container = canvas.getNodesContainer();
    const element = domify(`<div id="elt4" class="canvas-node-elt"><div id="header" class="canvas-block-elt">
    <div class="canvas-anchor" id="left-anchor"></div>
    <div class="canvas-anchor" id="right-anchor"></div>
    </div></div>`);    
    container.appendChild(element);
}

function bootstrap() {

    const root = document.getElementById("canvas");

    if (!root) {
        throw new Error("Missing container with canvas id");
    }

    const canvas = new Canvas(root);    
    
    document.querySelector('#autoLayout').addEventListener('click', () => applyAutoLayout(canvas));
    document.querySelector('#zoomToFit').addEventListener('click', () => zoomToFit(canvas));
    document.querySelector('#centerElts').addEventListener('click', () => centerElts(canvas));
    document.querySelector('#removeBlock').addEventListener('click', () => removeBlock(canvas, { nodeId: "elt2", blockId: "block2" }));
    document.querySelector('#addLink').addEventListener('click', () => addLink(canvas, 
        { nodeId: "elt1", blockId: "block2" },
        { nodeId: "elt2", blockId: "block1"})
    );
    document.querySelector('#updateLink').addEventListener('click', () => updateLink(canvas, 
        { nodeId: "elt1", blockId: "header"},
        { nodeId: "elt3", blockId: "header" })
    );
    document.querySelector('#removeNode').addEventListener('click', () => removeNode(canvas, "elt1"));
    document.querySelector('#addNode').addEventListener('click', () => addNode(canvas));
    document.querySelector('#importLayout').addEventListener('click', () => importLayout(canvas));
}

bootstrap();