// Code goes here!

// const form = document.querySelector("form");

// form?.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const titleEl = document.getElementById("title") as HTMLInputElement;
//   const descriptionEl = document.getElementById(
//     "description"
//   ) as HTMLInputElement;
//   const peopleEl = document.getElementById("people") as HTMLInputElement;

//   const title = titleEl.value;
//   const description = descriptionEl.value;
//   const people = +peopleEl.value;

//   const app = document.getElementById("app");
//   if (title && description && people) {
//     console.log("{object} :>> ", { title, description, people });
//   }
// });

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    const importedNodeContent = document.importNode(
      this.templateEl.content,
      true
    );
    this.element = importedNodeContent.firstElementChild as HTMLFormElement; // FormElement
    this.element.id = "user-input";

    this.attach();
  }
  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element); //Where to insert in our page
  }
}

const projInput = new ProjectInput();
