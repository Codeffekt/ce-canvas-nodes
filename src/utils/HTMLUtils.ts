export class HTMLUtils {

    static findFirstChildWithClass(root: HTMLElement, className: string): HTMLElement|null {
        for (let child of Array.from(root.children)) {
            if (child.classList.contains(className)) {
                return child as HTMLElement;
            }
            return null;
        }
    }

}