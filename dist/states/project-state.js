import { ProjectStatus } from "../models/project-model.js";
import { Project } from "../models/project-model.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListeners(listenFn) {
        this.listeners.push(listenFn);
    }
}
export class ProjectStateManager extends State {
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
export const projectState = ProjectStateManager.getInstance();
//# sourceMappingURL=project-state.js.map