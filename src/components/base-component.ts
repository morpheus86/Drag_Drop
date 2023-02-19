namespace App {
  export abstract class BaseClass<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateEl: HTMLTemplateElement;
    hostEl: T;
    element?: U;
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateEl = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostEl = document.getElementById(hostElementId)! as T;
      const importedNodeContent = document.importNode(
        this.templateEl.content,
        true
      );
      this.element = importedNodeContent.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      } // FormElement
      this.attach(insertAtStart);
    }
    private attach(insertAtBegining: boolean) {
      this.hostEl.insertAdjacentElement(
        insertAtBegining ? "afterbegin" : "beforeend",
        this.element!
      ); //Where to insert in our page
    }
    abstract configure(): void;
    abstract renderContent(): void;
  }
}
