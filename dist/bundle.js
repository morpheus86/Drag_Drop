"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    class Project {
        constructor(id, title, description, numberOfProple, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.numberOfProple = numberOfProple;
            this.status = status;
        }
    }
    App.Project = Project;
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
})(App || (App = {}));
var App;
(function (App) {
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
            const newProject = new App.Project(Math.random().toString(), title, description, numberOfPeople, App.ProjectStatus.Active);
            this.projects.push(newProject);
            for (const listen of this.listeners) {
                listen(this.projects.slice());
            }
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((prj) => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListener();
            }
        }
        updateListener() {
            for (const listen of this.listeners) {
                listen(this.projects.slice());
            }
        }
    }
    App.ProjectStateManager = ProjectStateManager;
    App.projectState = ProjectStateManager.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Autobind = Autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.BaseClass = BaseClass;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.BaseClass {
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
                App.projectState.addProject(title, desc, peopl);
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
            if (!App.validate(titleValid) ||
                !App.validate(descriptionValid) ||
                !App.validate(peopleValid)) {
                alert("Invalid Input");
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }
    }
    __decorate([
        App.Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    class ProjLis extends App.BaseClass {
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
                new App.ProjectItem(this.element.querySelector("ul").id, prjItem);
            }
        }
        configure() {
            var _a, _b, _c;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener("dragover", this.DragOverHandler);
            (_b = this.element) === null || _b === void 0 ? void 0 : _b.addEventListener("dragleave", this.dragLeaveHandler);
            (_c = this.element) === null || _c === void 0 ? void 0 : _c.addEventListener("drop", this.DropHandler);
            App.projectState.addListeners((projects) => {
                const relevantPrj = projects.filter((p) => {
                    if (this.type === "active") {
                        return p.status === App.ProjectStatus.Active;
                    }
                    else {
                        return p.status === App.ProjectStatus.Finished;
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
            App.projectState.moveProject(prjId, this.type === "active" ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector("ul");
            listEl === null || listEl === void 0 ? void 0 : listEl.classList.remove("droppable");
        }
    }
    __decorate([
        App.Autobind
    ], ProjLis.prototype, "DragOverHandler", null);
    __decorate([
        App.Autobind
    ], ProjLis.prototype, "DropHandler", null);
    __decorate([
        App.Autobind
    ], ProjLis.prototype, "dragLeaveHandler", null);
    App.ProjLis = ProjLis;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjLis("active");
    new App.ProjLis("finished");
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.BaseClass {
        get persons() {
            if (this.project.numberOfProple === 1) {
                return "1 person";
            }
            else {
                return `${this.project.numberOfProple} persons`;
            }
        }
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.persons + " assigned.";
            this.element.querySelector("p").textContent = this.project.description;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) { }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
    }
    __decorate([
        App.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map