export interface Draggable {
  dragStartHandler(e: DragEvent): void;
  dragEndHandler(e: DragEvent): void;
}

export interface DragTarget {
  dragOverHandler(e: DragEvent): void;
  dragHandler(e: DragEvent): void;
  dragLeaveHandler(e: DragEvent): void;
}