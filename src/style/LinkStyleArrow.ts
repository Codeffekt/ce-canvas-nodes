import { LinkStyle } from "./LinkStyle";
import { MarkerElementArrow } from "./MarkerElementArrow";
import { MarkerElementCircle } from "./MarkerElementCircle";

export class LinkStyleArrow implements LinkStyle {
    
    static LINK_STYLE_NAME = "arrow";    

    applySVGPathStyle(path: SVGPathElement): void {
        path.setAttributeNS(null, "fill", "transparent");
        path.setAttributeNS(null, "class", "connector");
        path.setAttributeNS(null, "pointer-events", "stroke");        
        path.setAttributeNS(null, "marker-start", `url(#${MarkerElementArrow.MARKER_ID})`);
        path.setAttributeNS(null, "marker-end", `url(#${MarkerElementCircle.MARKER_ID})`);
    }

    getLinkStyleName(): string {
        return LinkStyleArrow.LINK_STYLE_NAME;
    }
    
}