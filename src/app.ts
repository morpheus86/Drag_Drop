// Code goes here!
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
class ProjLis {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    const importedNodeContent = document.importNode(
      this.templateEl.content,
      true
    );
    this.element = importedNodeContent.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }
  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element); //Where to insert in our page
  }
}
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  personEl: HTMLInputElement;
  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    const importedNodeContent = document.importNode(
      this.templateEl.content,
      true
    );
    this.element = importedNodeContent.firstElementChild as HTMLFormElement; // FormElement
    this.element.id = "user-input";

    this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.personEl = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }
  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, peopl] = userInput;
      console.log("title :>> ", title, " ", desc, "", peopl);
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
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element); //Where to insert in our page
  }
}

const projInput = new ProjectInput();
const activePrjList = new ProjLis("active");
const finishedPrjList = new ProjLis("finished");
