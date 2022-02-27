// Base component, we abstract to make sure it's never instantiate, only extended
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  containerElement: T;
  element: U;

  constructor(
    templateId: string,
    containerId: string,
    insertStart: boolean,
    newElement?: string
  ) {
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
    if (newElement) {
      this.element.id = newElement;
    }

    this.attachElement(insertStart);
  }

  private attachElement(whereToInsert: boolean) {
    this.containerElement.insertAdjacentElement(
      whereToInsert ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  // Forcing implementation
  abstract setupListeners(): void;
}