// Module import
import { Project, ProjectStatus } from '../models/Project';

// Here we create a specific type for the listeners, so we make sure that the objects passed follows the project class
type Listeners = (obj: Project[]) => void;

/* Projects status management
 * First we add a new project passing an object with the date, once it's done we push it to the projects array
 * We create a static instance to make sure all the instances are unique
 * To make sure that when a new project is added we update the state, we create a listeners array containing functions
 * We loop through the listeners and pass the specific listenerFn that project */
class ProjectState {
  private listeners: Listeners[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  public addListener(listenerFn: Listeners) {
    this.listeners.push(listenerFn);
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      (Math.floor(Math.random() * 1000) + 1).toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  public switchStatus(projId: string, newStatus: ProjectStatus) {
    const proj = this.projects.find(item => item.id === projId);
    if(proj) {
      proj.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (let listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// We declare the class here, so we are able to access it in other classes
export const projectState = ProjectState.getInstance();