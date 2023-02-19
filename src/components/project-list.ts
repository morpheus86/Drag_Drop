import { BaseClass } from "./base-component";
import { projectState } from "../states/project-state";
import { Autobind } from "../decorators/autobind-decorator";
import { ProjectItem } from "./project-items";
import { Project } from "../models/project-model";
import { DragTarget } from "../models/drag-drop-interfaces";
import { ProjectStatus } from "../models/project-model";

export class ProjLis
  extends BaseClass<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProject: Project[] = [];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.assignedProject = [];
    this.configure();
    this.renderContent();
  }
  private renderPrj() {
    const listElement = document.getElementById(
      `${this.type}-project-list`
    ) as HTMLUListElement;
    listElement.innerHTML = "";
    for (const prjItem of this.assignedProject) {
      new ProjectItem(this.element!.querySelector("ul")!.id, prjItem);
    }
  }
  configure() {
    this.element?.addEventListener("dragover", this.DragOverHandler);
    this.element?.addEventListener("dragleave", this.dragLeaveHandler);
    this.element?.addEventListener("drop", this.DropHandler);
    projectState.addListeners((projects: Project[]) => {
      const relevantPrj = projects.filter((p) => {
        if (this.type === "active") {
          return p.status === ProjectStatus.Active;
        } else {
          return p.status === ProjectStatus.Finished;
        }
      });
      this.assignedProject = relevantPrj;
      this.renderPrj();
    });
  }
  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element!.querySelector("ul")!.id = listId;
    this.element!.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
  @Autobind
  DragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element!.querySelector("ul");
      listEl?.classList.add("droppable");
    }
  }
  @Autobind
  DropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }
  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element!.querySelector("ul");
    listEl?.classList.remove("droppable");
  }
}
