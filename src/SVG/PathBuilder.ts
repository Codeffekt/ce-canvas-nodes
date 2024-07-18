import { Canvas, CanvasBlockElt } from "../canvas";
import { CoordsUtils } from "../utils/CoordsUtils";
import { SVG, SVGPointPair } from "./SVG";

export class PathBuilder {

    static findBestAnchorPoints(canvas: Canvas, src: CanvasBlockElt, dst: CanvasBlockElt): SVGPointPair {

        const srcAnchorLeft = SVG.getCenterPoint(src.getLeftAnchor());
        const srcAnchorRight = SVG.getCenterPoint(src.getRightAnchor());
        const dstAnchorLeft = SVG.getCenterPoint(dst.getLeftAnchor());
        const dstAnchorRight = SVG.getCenterPoint(dst.getRightAnchor());

        const srcPoint = SVG.getCenterPoint(src.nativeElement());
        const dstPoint = SVG.getCenterPoint(dst.nativeElement());


        const srcAnchor = SVG.getXDistance(srcAnchorRight, dstPoint) >
            SVG.getXDistance(srcAnchorLeft, dstPoint) ?
            srcAnchorLeft : srcAnchorRight;

        const dstAnchor = SVG.getXDistance(dstAnchorRight, srcPoint) >
            SVG.getXDistance(dstAnchorLeft, srcPoint) ?
            dstAnchorLeft : dstAnchorRight;

        return {
            a: CoordsUtils.getPointPositionInCanvasCoords(canvas, srcAnchor),
            b: CoordsUtils.getPointPositionInCanvasCoords(canvas, dstAnchor),
        };
    }

}