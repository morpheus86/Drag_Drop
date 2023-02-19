import { BaseClass } from "./base-component";
import { Autobind } from "../decorators/autobind-decorator";
import { Project } from "../models/project-model";
import { Draggable } from "../models/drag-drop-interfaces";
export class ProjectItem
  extends BaseClass<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;
  get persons() {
    if (this.project.numberOfProple === 1) {
      return "1 person";
    } else {
      return `${this.project.numberOfProple} persons`;
    }
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  renderContent() {
    this.element!.querySelector("h2")!.textContent = this.project.title;
    this.element!.querySelector("h3")!.textContent =
      this.persons + " assigned.";
    this.element!.querySelector("p")!.textContent = this.project.description;
  }
  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent): void {}
  configure() {
    this.element!.addEventListener("dragstart", this.dragStartHandler);
    this.element!.addEventListener("dragend", this.dragEndHandler);
  }
}
