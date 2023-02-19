var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseClass } from "./base-component.js";
import { projectState } from "../states/project-state.js";
import { Autobind } from "../decorators/autobind-decorator.js";
import { ProjectItem } from "./project-items.js";
import { ProjectStatus } from "../models/project-model.js";
export class ProjLis extends BaseClass {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProject = [];
        this.templateEl = document.getElementById("project-list");
        this.assignedProject = [];
        this.configure();
        this.renderContent();
    }
    renderPrj() {
        const listElement = document.getElementById(`${this.type}-project-list`);
        listElement.innerHTML = "";
        for (const prjItem of this.assignedProject) {
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
        }
    }
    configure() {
        var _a, _b, _c;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener("dragover", this.DragOverHandler);
        (_b = this.element) === null || _b === void 0 ? void 0 : _b.addEventListener("dragleave", this.dragLeaveHandler);
        (_c = this.element) === null || _c === void 0 ? void 0 : _c.addEventListener("drop", this.DropHandler);
        projectState.addListeners((projects) => {
            const relevantPrj = projects.filter((p) => {
                if (this.type === "active") {
                    return p.status === ProjectStatus.Active;
                }
                else {
                    return p.status === ProjectStatus.Finished;
                }
            });
            this.assignedProject = relevantPrj;
            this.renderPrj();
        });
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    DragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listEl = this.element.querySelector("ul");
            listEl === null || listEl === void 0 ? void 0 : listEl.classList.add("droppable");
        }
    }
    DropHandler(event) {
        const prjId = event.dataTransfer.getData("text/plain");
        projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector("ul");
        listEl === null || listEl === void 0 ? void 0 : listEl.classList.remove("droppable");
    }
}
__decorate([
    Autobind
], ProjLis.prototype, "DragOverHandler", null);
__decorate([
    Autobind
], ProjLis.prototype, "DropHandler", null);
__decorate([
    Autobind
], ProjLis.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map