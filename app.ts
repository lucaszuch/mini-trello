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

// We just use enum as we have only 2 'status' to manage
enum ProjectStatus {
  active,
  completed,
}

// Start a project class, so we are able to instantiate it on different classes
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus
  ) {
    // Classes go here!
  }
}

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
    for (let listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// We declare the class here, so we are able to access it in other classes
const projectState = ProjectState.getInstance();

// Base component, we abstract to make sure it's never instantiate, only extended
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  containerElement: T;
  element: U;

  constructor(templateId: string, containerId: string, insertStart: boolean, newElement?: string) {
    // Element fields
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.containerElement = document.getElementById(containerId)! as T;

    // Display template
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if(newElement) {
      this.element.id = newElement;
    }

    this.attachElement(insertStart);
  }

  private attachElement(whereToInsert: boolean) {
    this.containerElement.insertAdjacentElement(whereToInsert ? 'afterbegin' : 'beforeend', this.element);
  }

  // Forcing implementation
  abstract setupListeners(): void;
}

// Resposible to render the project lists
class ProjectList extends Component<HTMLDListElement,HTMLElement> {
  assignProject: Project[];

  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignProject = [];

    // Register listener
    projectState.addListener((projects: Project[]) => {
      const filterProjects = projects.filter((singleProject) => {
        if(this.type == 'active') {
          return singleProject.status === ProjectStatus.active;
        }
        return singleProject.status === ProjectStatus.completed;
      })
      this.assignProject = filterProjects;
      this.renderProjects();
    });

    // Methods
    this.renderElements();
  }

  setupListeners(): void {
    // Do nothing
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = ''; // Avoid duplication
    for (let item of this.assignProject) {
      let listItem = document.createElement('li');
      listItem.textContent = item.title;
      listElement.appendChild(listItem);
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

// Responsible to display the form and manage the user input (fetch + validation)
class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
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

// Instantiate classes
const newProject = new ProjectForm();
const activeProjects = new ProjectList('active');
const completedProjects = new ProjectList('completed');
