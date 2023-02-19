namespace App {
  // Drag and Drop interfaces
  export interface Draggable {
    // listener method
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }
  export interface DragTarget {
    DragOverHandler(event: DragEvent): void;
    DropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}
