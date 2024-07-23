export class HTMLUtils {

    static findFirstChildWithClass(root: HTMLElement, className: string): HTMLElement|null {
        const elements = root.getElementsByClassName(className);
        return elements.length && elements[0] instanceof HTMLElement ? elements[0] : null;
    }

}