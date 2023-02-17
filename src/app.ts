// Code goes here!

// Drag and Drop interfaces
interface Draggable {
  // listener method
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  DragOverHandler(event: DragEvent): void;
  DropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
// Project Type
enum ProjectStatus {
  Active,
  Finished,
}
// Class used for inheritance and reusable code to be extended on other classes
abstract class BaseClass<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element?: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;
    const importedNodeContent = document.importNode(
      this.templateEl.content,
      true
    );
    this.element = importedNodeContent.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    } // FormElement
    this.attach(insertAtStart);
  }
  private attach(insertAtBegining: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtBegining ? "afterbegin" : "beforeend",
      this.element!
    ); //Where to insert in our page
  }
  abstract configure(): void;
  abstract renderContent(): void;
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numberOfProple: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListeners(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}
class ProjectStateManager extends State<Project> {
  // subscription patterns
  private projects: Project[] = [];
  private static instance: ProjectStateManager;
  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectStateManager();
    return this.instance;
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listen of this.listeners) {
      // THis is to make sure we get brand new copy of the object and avoid bugs and cant be edited from where the original arr is coming from since array and object are reference value in JS
      listen(this.projects.slice());
    }
  }
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project) {
      project.status = newStatus;
      this.updateListener();
    }
  }
  private updateListener() {
    for (const listen of this.listeners) {
      // THis is to make sure we get brand new copy of the object and avoid bugs and cant be edited from where the original arr is coming from since array and object are reference value in JS
      listen(this.projects.slice());
    }
  }
}

// Singleton so the state is created only once and not duplicate
const projectState = ProjectStateManager.getInstance();
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(InputToValidate: Validatable) {
  let isValid = true;
  if (InputToValidate.required) {
    isValid = isValid && InputToValidate.value.toString().length !== 0;
  }
  if (
    InputToValidate.minLength != null &&
    typeof InputToValidate.value === "string"
  ) {
    isValid =
      isValid && InputToValidate.value.length > InputToValidate.minLength;
  }
  if (
    InputToValidate.maxLength != null &&
    typeof InputToValidate.value === "string"
  ) {
    isValid =
      isValid && InputToValidate.value.length < InputToValidate.maxLength;
  }
  if (
    InputToValidate.min != null &&
    typeof InputToValidate.value === "number"
  ) {
    isValid = isValid && InputToValidate.value > InputToValidate.min;
  }
  if (
    InputToValidate.max != null &&
    typeof InputToValidate.value === "number"
  ) {
    isValid = isValid && InputToValidate.value < InputToValidate.max;
  }
  return isValid;
}

function Autobind(
  _1: any,
  _2: string | Symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  // console.log("descriptor :>> ", descriptor, target, name);
  const originalMethod = descriptor.value;
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const bindFn = originalMethod.bind(this);
      return bindFn;
    },
  };
  return newDescriptor;
}
class ProjectItem
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
class ProjLis
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
class ProjectInput extends BaseClass<HTMLDivElement, HTMLFormElement> {
  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  personEl: HTMLInputElement;
  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleEl = this.element!.querySelector("#title") as HTMLInputElement;
    this.descriptionEl = this.element!.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.personEl = this.element!.querySelector("#people") as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.titleEl = this.element!.querySelector("#title") as HTMLInputElement;
    this.descriptionEl = this.element!.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.personEl = this.element!.querySelector("#people") as HTMLInputElement;
    this.element!.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}
  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, peopl] = userInput;
      projectState.addProject(title, desc, peopl);
      this.clearInput();
    }
  }
  private clearInput() {
    this.titleEl.value = "";
    this.descriptionEl.value = "";
    this.personEl.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleEl.value;
    const enteredDescription = this.descriptionEl.value;
    const enteredPeople = this.personEl.value;

    const titleValid: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValid: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValid: Validatable = {
      value: +enteredPeople,
      required: true,
      minLength: 1,
      maxLength: 5,
    };
    if (
      !validate(titleValid) ||
      !validate(descriptionValid) ||
      !validate(peopleValid)
    ) {
      alert("Invalid Input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }
}

const projInput = new ProjectInput();
const activePrjList = new ProjLis("active");
const finishedPrjList = new ProjLis("finished");

// Class that manages states of our application (storage)
