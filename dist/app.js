"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class BaseClass {
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
class Project {
    constructor(id, title, description, numberOfProple, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.numberOfProple = numberOfProple;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListeners(listenFn) {
        this.listeners.push(listenFn);
    }
}
class ProjectStateManager extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectStateManager();
        return this.instance;
    }
    addProject(title, description, numberOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listen of this.listeners) {
            listen(this.projects.slice());
        }
    }
}
const projectState = ProjectStateManager.getInstance();
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
class ProjLis extends BaseClass {
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
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listElement === null || listElement === void 0 ? void 0 : listElement.appendChild(listItem);
        }
    }
    configure() {
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
}
class ProjectInput extends BaseClass {
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
const projInput = new ProjectInput();
const activePrjList = new ProjLis("active");
const finishedPrjList = new ProjLis("finished");
//# sourceMappingURL=app.js.map