/// <reference path="models/drag-drop-interfaces.ts" />
/// <reference path="models/project-model.ts" />
/// <reference path="states/project-state.ts" />
/// <reference path="utils/validation.ts" />
/// <reference path="decorators/autobind-decorator.ts" />
/// <reference path="./components/project-input.ts" />
/// <reference path="./components/project-list.ts" />
// Code goes here!

namespace App {
  new ProjectInput();
  new ProjLis("active");
  new ProjLis("finished");
}
