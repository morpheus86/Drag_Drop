export class BaseClass {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedNodeContent = document.importNode(this.templateEl.content, true);
        this.element = importedNodeContent.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBegining) {
        this.hostEl.insertAdjacentElement(insertAtBegining ? "afterbegin" : "beforeend", this.element);
    }
}
//# sourceMappingURL=base-component.js.map