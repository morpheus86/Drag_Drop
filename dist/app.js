"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(InputToValidate) {
    let isValid = true;
    if (InputToValidate.required) {
        isValid = isValid && InputToValidate.value.toString().length !== 0;
    }
    if (InputToValidate.minLength != null &&
        typeof InputToValidate.value === "string") {
        isValid =
            isValid && InputToValidate.value.length > InputToValidate.minLength;
    }
    if (InputToValidate.maxLength != null &&
        typeof InputToValidate.value === "string") {
        isValid =
            isValid && InputToValidate.value.length < InputToValidate.maxLength;
    }
    if (InputToValidate.min != null &&
        typeof InputToValidate.value === "number") {
        isValid = isValid && InputToValidate.value > InputToValidate.min;
    }
    if (InputToValidate.max != null &&
        typeof InputToValidate.value === "number") {
        isValid = isValid && InputToValidate.value < InputToValidate.max;
    }
    return isValid;
}
function Autobind(_1, _2, descriptor) {
    const originalMethod = descriptor.value;
    const newDescriptor = {
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
    constructor(type) {
        this.type = type;
        this.templateEl = document.getElementById("project-list");
        this.hostEl = document.getElementById("app");
        const importedNodeContent = document.importNode(this.templateEl.content, true);
        this.element = importedNodeContent.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    attach() {
        this.hostEl.insertAdjacentElement("beforeend", this.element);
    }
}
class ProjectInput {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.hostEl = document.getElementById("app");
        const importedNodeContent = document.importNode(this.templateEl.content, true);
        this.element = importedNodeContent.firstElementChild;
        this.element.id = "user-input";
        this.titleEl = this.element.querySelector("#title");
        this.descriptionEl = this.element.querySelector("#description");
        this.personEl = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, peopl] = userInput;
            console.log("title :>> ", title, " ", desc, "", peopl);
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
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projInput = new ProjectInput();
const activePrjList = new ProjLis("active");
const finishedPrjList = new ProjLis("finished");
//# sourceMappingURL=app.js.map