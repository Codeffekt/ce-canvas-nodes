import { LinkStyle } from "./LinkStyle";
import { MarkerElementCircle } from "./MarkerElementCircle";
import { MarkerElementSquare } from "./MarkerElementSquare";

export class LinkStyleSquare implements LinkStyle {
    
    static LINK_STYLE_NAME = "square";    

    applySVGPathStyle(path: SVGPathElement): void {
        path.setAttributeNS(null, "fill", "transparent");
        path.setAttributeNS(null, "class", "connector");
        path.setAttributeNS(null, "pointer-events", "stroke");        
        path.setAttributeNS(null, "marker-start", `url(#${MarkerElementSquare.MARKER_ID})`);
        path.setAttributeNS(null, "marker-end", `url(#${MarkerElementCircle.MARKER_ID})`);
    }
    
    getLinkStyleName(): string {
        return LinkStyleSquare.LINK_STYLE_NAME;
    }            
}