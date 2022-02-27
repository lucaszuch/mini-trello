// Module import
import { AutoBinder } from "../decorators/AutoBinder.js";
import { Component } from "./BaseComponente.js";
import { projectState } from "../util/ProjectState.js";

// Responsible to display the form and manage the user input (fetch + validation)
export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  // Elements properties
  titleElement: HTMLInputElement;
  descriptionElement: HTMLTextAreaElement;
  peopleElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    // Fetch values from the DOM
    this.titleElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionElement = this.element.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    this.peopleElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    // Methods
    this.setupListeners();
  }

  setupListeners() {
    this.element.addEventListener('submit', this.submitHandler); // Could use the standard .bind();
  }

  private validateUserInput(
    type: string,
    value: string | number
  ): boolean | void {
    let isValid = false;
    if (type == 'text') {
      let stringValue = value.toString();
      if (stringValue.trim().length != 0) {
        isValid = true;
      }
    }

    if (type == 'number') {
      let numberValue = +value;
      if (numberValue > 0) {
        isValid = true;
      }
    }

    return isValid;
  }

  private fetchUserInput(): [string, string, number] | void {
    let enteredTitle = this.titleElement.value;
    let enteredDescription = this.descriptionElement.value;
    let enteredPeople = this.peopleElement.value;

    if (
      this.validateUserInput('text', enteredTitle) == false ||
      this.validateUserInput('text', enteredDescription) == false ||
      this.validateUserInput('number', enteredPeople) == false
    ) {
      alert('Invalid input, please check the input fields!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearUserInput() {
    this.titleElement.value = '';
    this.descriptionElement.value = '';
    this.peopleElement.value = '';
  }

  @AutoBinder
  private submitHandler(e: Event) {
    e.preventDefault();
    let fetchUserInput = this.fetchUserInput();
    if (Array.isArray(fetchUserInput)) {
      const [title, description, people] = fetchUserInput;
      projectState.addProject(title, description, people);
    }
    this.clearUserInput();
  }
}