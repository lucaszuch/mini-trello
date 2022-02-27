// We just use enum as we have only 2 'status' to manage
export enum ProjectStatus {
  active,
  completed,
}

// Start a project class, so we are able to instantiate it on different classes
export class Project {
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