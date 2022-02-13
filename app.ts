// Decorators
function AutoBinder(_: any, _2: string, descriptor: PropertyDescriptor) {
  // _ and _2 are 'convetional' to declare something that won't be used
  const originalHandler = descriptor.value;
  const propDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const bindFunction = originalHandler.bind(this);
      return bindFunction;
    },
  };
  return propDescriptor;
}

// Creates the project class
class ProjectForm {
  // Elements properties
  templateElement: HTMLTemplateElement;
  containerElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleElement: HTMLInputElement;
  descriptionElement: HTMLTextAreaElement;
  peopleElement: HTMLInputElement;

  constructor() {
    // Element fields
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.containerElement = document.getElementById('app')! as HTMLDivElement;

    // Display template
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input';

    // Fetch values from the DOM
    this.titleElement = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionElement = this.formElement.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    this.peopleElement = this.formElement.querySelector(
      '#people'
    ) as HTMLInputElement;

    // Methods
    this.attachElement();
    this.setupListeners();
  }

  private attachElement() {
    this.containerElement.insertAdjacentElement('afterbegin', this.formElement);
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
    if(Array.isArray(fetchUserInput)) {
      const [title, description, people] = fetchUserInput;
      console.log(title, description, people);
    }
    this.clearUserInput();
  }

  private setupListeners() {
    this.formElement.addEventListener('submit', this.submitHandler); // Could use the standard .bind();
  }
}

const newProject = new ProjectForm();
