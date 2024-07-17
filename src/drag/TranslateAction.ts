import { TranslateEventProvider } from "../events/TranslateEvent";

export class TranslateAction {

    private isDragging = false;

    private start = {
        x: 0,
        y: 0
    };

    private client = {
        x: 0,
        y: 0
    };

    private translation = {
        tx: 0,
        ty: 0
    };

    private scale = 1;

    constructor(private elt: HTMLElement, private evtProvider: TranslateEventProvider) {
        this.createEventListeners();
    }

    private createEventListeners() {

        this.elt.addEventListener("mousedown", (event: MouseEvent) => {
            this.onDragMouseDown(event);
        });
    }

    private onDragMouseDown(event: MouseEvent) {

        if (event.button !== 1) {
            return false;
        }

        this.evtProvider.onElementStartTranslation();
        this.isDragging = true;
        event.preventDefault();

        this.client.x = event.clientX;
        this.client.y = event.clientY;

        this.retrieveCurrentTransform();

        this.start.x = this.translation.tx;
        this.start.y = this.translation.ty;

        document.onmouseup = () => this.closeDragElement();
        document.onmousemove = (event) => this.elementDrag(event);
        this.evtProvider.onElementTranslated();
    }

    private closeDragElement() {
        this.evtProvider.onElementEndTranslation();
        this.isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }

    private elementDrag(event: MouseEvent) {

        if (!this.isDragging) {
            return;
        }

        event.preventDefault();

        const direction = 1;
        this.translation.tx = this.start.x + (event.clientX - this.client.x) * direction;
        this.translation.ty = this.start.y + (event.clientY - this.client.y) * direction;
        this.transform();
        this.evtProvider.onElementEndTranslation();
    }

    private transform() {
        const tcmd = `translate(${this.translation.tx}px, ${this.translation.ty}px)`;
        const scmd = `scale(${this.scale})`;
        const cmd = tcmd + " " + scmd;
        this.elt.style.transform = cmd;
    }

    private retrieveCurrentTransform() {
        if (window.getComputedStyle(this.elt)) {
            const computedStyle = window.getComputedStyle(this.elt);
            const transformValue = computedStyle.getPropertyValue('transform');
            if (transformValue !== "none") {
                const transformMatrix = transformValue.match(/matrix.*\((.+)\)/)[1].split(', ');
                const translateX = parseFloat(transformMatrix[4]);
                const translateY = parseFloat(transformMatrix[5]);
                const scaleX = parseFloat(transformMatrix[0]);
                this.translation.tx = translateX;
                this.translation.ty = translateY;
                this.scale = scaleX;
            }
        }
    }
}