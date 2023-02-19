import { BaseClass } from "./base-component";
import { validate } from "../utils/validation";
import { Validatable } from "../utils/validation";
import { projectState } from "../states/project-state";
import { Autobind } from "../decorators/autobind-decorator";
export class ProjectInput extends BaseClass<HTMLDivElement, HTMLFormElement> {
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
