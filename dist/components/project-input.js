var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseClass } from "./base-component.js";
import { validate } from "../utils/validation.js";
import { projectState } from "../states/project-state.js";
import { Autobind } from "../decorators/autobind-decorator.js";
export class ProjectInput extends BaseClass {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleEl = this.element.querySelector("#title");
        this.descriptionEl = this.element.querySelector("#description");
        this.personEl = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.titleEl = this.element.querySelector("#title");
        this.descriptionEl = this.element.querySelector("#description");
        this.personEl = this.element.querySelector("#people");
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, peopl] = userInput;
            projectState.addProject(title, desc, peopl);
            this.clearInput();
        }
    }
    clearInput() {
        this.titleEl.value = "";
        this.descriptionEl.value = "";
        this.personEl.value = "";
    }
    gatherUserInput() {
        const enteredTitle = this.titleEl.value;
        const enteredDescription = this.descriptionEl.value;
        const enteredPeople = this.personEl.value;
        const titleValid = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValid = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValid = {
            value: +enteredPeople,
            required: true,
            minLength: 1,
            maxLength: 5,
        };
        if (!validate(titleValid) ||
            !validate(descriptionValid) ||
            !validate(peopleValid)) {
            alert("Invalid Input");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map