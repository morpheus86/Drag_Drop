import { ProjectStatus } from "../models/project-model";
import { Project } from "../models/project-model";
export type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListeners(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}
export class ProjectStateManager extends State<Project> {
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
    if (project && project.status !== newStatus) {
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
export const projectState = ProjectStateManager.getInstance();
