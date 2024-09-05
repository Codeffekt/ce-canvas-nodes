import { SelectionEventProvider } from "../events/SelectionEvent";

export class SelectionAction {

    constructor(private elt: HTMLElement, private evtProvider: SelectionEventProvider) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.elt.addEventListener("mouseenter", (event: MouseEvent) => {
            this.onMouseEnter(event);
        });

        this.elt.addEventListener("mouseleave", (event: MouseEvent) => {
            this.onMouseLeave(event);
        });
    }

    private onMouseEnter(event: MouseEvent) {
        this.evtProvider.onElementSelectionEnter();
    }

    private onMouseLeave(event: MouseEvent) {
        this.evtProvider.onElementSelectionLeave();
    }
}