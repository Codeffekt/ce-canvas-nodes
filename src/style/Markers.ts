import { MarkerElementArrow } from "./MarkerElementArrow";
import { MarkerElementCircle } from "./MarkerElementCircle";
import { MarkerElementSquare } from "./MarkerElementSquare";
import { MarkerElementStyle } from "./MarkerElementStyle";
import { Style } from "./Style";

export class Markers {

    private constructor(private style: Style) { }

    static createMarkerElements(style: Style): SVGMarkerElement[] {

        const markers = new Markers(style);

        return [
            ...markers.createMarkerElementsWithFunc(
                MarkerElementArrow.MARKER_ID,
                MarkerElementArrow.create,
            ),
            ...markers.createMarkerElementsWithFunc(
                MarkerElementCircle.MARKER_ID,
                MarkerElementCircle.create,
            ),
            ...markers.createMarkerElementsWithFunc(
                MarkerElementSquare.MARKER_ID,
                MarkerElementSquare.create,
            ),
        ];
    }

    private createMarkerElementsWithFunc(markerId: string, createMarkerFunc: Function): SVGMarkerElement[] {
        const markerElementStyles: MarkerElementStyle[] =
            ["", "draft", "over", "selected"].map(type => ({
                id: type.length ? `${markerId}_${type}` : markerId,
                fill: this.style.getColor(type.length ? `fill-${type}` : "fill"),
                class: this.style.getClass(type.length ? `connector_${type}` : "connector"),
                stroke: this.style.getColor(type.length ? `stroke-${type}`: "stroke"),
                strokeWidth: this.style.getStrokeWidth(),
            }));
        return markerElementStyles
            .map(markerElementStyle => createMarkerFunc(markerElementStyle));
    }
}