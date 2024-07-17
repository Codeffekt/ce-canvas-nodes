import { CanvasBlockElt } from "../canvas";

export interface AnchorPair {
    src: HTMLElement;
    dst: HTMLElement;
}

function getCenterXDistance(a: DOMRect, b: DOMRect) {
    return Math.abs(((a.left + a.right) / 2.0) - ((b.left + b.right) / 2.0));
}

export class PathBuilder {    

    static findBestAnchorPair(src: CanvasBlockElt, dst: CanvasBlockElt): AnchorPair {

        const srcAnchorLeft = src.getLeftAnchor();
        const srcAnchorRight = src.getRightAnchor();
        const dstAnchorLeft = dst.getLeftAnchor();
        const dstAnchorRight = dst.getRightAnchor();

        const srcAnchor = getCenterXDistance(
            srcAnchorRight.getBoundingClientRect(),
            dst.getBoundingClientRect()
        ) > getCenterXDistance(
            srcAnchorLeft.getBoundingClientRect(),
            dst.getBoundingClientRect()
        ) ?
            srcAnchorLeft : srcAnchorRight;

        const dstAnchor = getCenterXDistance(
            dstAnchorRight.getBoundingClientRect(),
            src.getBoundingClientRect(),
        ) > getCenterXDistance(
            dstAnchorLeft.getBoundingClientRect(),
            src.getBoundingClientRect()
        ) ?
            dstAnchorLeft : dstAnchorRight;

        return {
            src: srcAnchor,
            dst: dstAnchor
        };
    }

}