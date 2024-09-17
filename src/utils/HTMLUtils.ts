export class HTMLUtils {

    static findFirstChildWithClass(root: HTMLElement, className: string): HTMLElement|null {
        const elements = root.getElementsByClassName(className);
        return elements.length && elements[0] instanceof HTMLElement ? elements[0] : null;
    }

    static getFloatAttribute(element: HTMLElement, attrName: string): number|null {
        const attributeString = element.getAttribute(attrName);
        if(!attributeString) {
            return null;
        }
        const attributeNumber = parseFloat(attributeString);
        return isNaN(attributeNumber) ? null : attributeNumber;
    }
}