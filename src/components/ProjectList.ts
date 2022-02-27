// Module import
import { AutoBinder } from "../decorators/AutoBinder";
import { Project, ProjectStatus } from "../models/Project";
import { projectState } from "../util/ProjectState";
import { DragTarget } from "../interfaces/draggable";
import { Component } from "./BaseComponente";
import { ListItem } from "../components/ProjectItem";

// Resposible to render the project lists
export class ProjectList extends Component<HTMLDListElement, HTMLElement> implements DragTarget{
  assignProject: Project[];

  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignProject = [];

    // Register listener
    projectState.addListener((projects: Project[]) => {
      const filterProjects = projects.filter((singleProject) => {
        if (this.type == 'active') {
          return singleProject.status === ProjectStatus.active;
        }
        return singleProject.status === ProjectStatus.completed;
      });
      this.assignProject = filterProjects;
      this.renderProjects();
      this.setupListeners();
    });

    // Methods
    this.renderElements();
  }


  @AutoBinder
  dragLeaveHandler(e: DragEvent) {
    e.preventDefault();
    const dragContainer = this.element.querySelector('ul')!;
    dragContainer.classList.remove('droppable');
  }

  @AutoBinder
  dragHandler(e: DragEvent) {
    let projectId = e.dataTransfer!.getData('text/plain');
    projectState.switchStatus(projectId, this.type === 'active' ? ProjectStatus.active : ProjectStatus.completed);
  }

  @AutoBinder
  dragOverHandler(e: DragEvent) {
    if(e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      e.preventDefault();
      const dragContainer = this.element.querySelector('ul')!;
      dragContainer.classList.add('droppable');
    }
  }

  setupListeners() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dragHandler);
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = ''; // Avoid duplication
    for (let item of this.assignProject) {
      new ListItem(this.element.querySelector('ul')!.id, item);
    }
  }

  private renderElements() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}