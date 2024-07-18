import { CanvasTransform } from "../canvas";

export class CSS {

    static applyTransformOnStyle(elt: HTMLElement|SVGElement, transform: CanvasTransform) {
        const tcmd = `translate(${transform.translation.tx}px, ${transform.translation.ty}px)`;
        const scmd = `scale(${transform.scale})`;
        const cmd = tcmd + " " + scmd;
        elt.style.transform = cmd;
    }

    static updateTransform(elt: HTMLElement|SVGElement, transform: CanvasTransform) {
        if (window.getComputedStyle(elt)) {
            const computedStyle = window.getComputedStyle(elt);
            const transformValue = computedStyle.getPropertyValue('transform');
            if (transformValue !== "none") {
                const transformMatrix = transformValue.match(/matrix.*\((.+)\)/)[1].split(', ');
                const translateX = parseFloat(transformMatrix[4]);
                const translateY = parseFloat(transformMatrix[5]);
                const scaleX = parseFloat(transformMatrix[0]);
                transform.translation.tx = translateX;
                transform.translation.ty = translateY;
                transform.scale = scaleX;
            }
        }
    }

}