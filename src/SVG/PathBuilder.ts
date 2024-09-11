import { Canvas, CanvasBlockElt } from "../canvas";
import { CoordsUtils } from "../utils/CoordsUtils";
import { SVG, SVGPointPair,SVGPoint } from "./SVG";

function findAnchorPointWithMinDistanceFromPoint(anchors: HTMLElement[], from: SVGPoint): SVGPoint {
    let minDistance = Infinity;
    let pointFound = null;
    for (const anchorElement of anchors) {
        const centerPoint = SVG.getCenterPoint(anchorElement);
        const distance = SVG.getXDistance(centerPoint, from)
        if (distance < minDistance) {
            minDistance = distance;
            pointFound = centerPoint;
        }
    }
    return pointFound;
}

export class PathBuilder {

    static findBestAnchorPoints(canvas: Canvas, src: CanvasBlockElt, dst: CanvasBlockElt): SVGPointPair {

        const srcPoint = SVG.getCenterPoint(src.nativeElement());
        const dstPoint = SVG.getCenterPoint(dst.nativeElement());

        const srcAnchor = findAnchorPointWithMinDistanceFromPoint(src.getAnchors(), dstPoint);
        const dstAnchor = findAnchorPointWithMinDistanceFromPoint(dst.getAnchors(), srcPoint);        

        return {
            a: CoordsUtils.getPointPositionInCanvasCoords(canvas, srcAnchor),
            b: CoordsUtils.getPointPositionInCanvasCoords(canvas, dstAnchor),
        };
    }

}