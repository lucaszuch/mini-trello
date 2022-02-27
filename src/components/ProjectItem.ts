// Module import
import { AutoBinder } from "../decorators/AutoBinder.js";
import { Project } from "../models/Project.js";
import { Component } from "./BaseComponente.js";
import { Draggable } from "../interfaces/draggable.js";

export class ListItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
  private project: Project;

  get team() {
    if(this.project.numOfPeople == 1) {
      return '1 person';
    } else {
      return `${this.project.numOfPeople} people`;
    }
  }

  constructor(containerId: string, project: Project) {
    super('single-project', containerId, false, project.id);
    this.project = project;

    this.setupListeners();
    this.renderList();
  }

  @AutoBinder
  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  @AutoBinder
  dragStartHandler(e: DragEvent) {
    e.dataTransfer!.setData('text/plain', this.project.id);
    e.dataTransfer!.effectAllowed = 'move';
  }

  setupListeners() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  private renderList() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.team;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}