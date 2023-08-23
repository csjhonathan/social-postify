export class Media {
  private id: number;
  public title: string;
  public username: string;

  constructor(id: number, title: string, username: string) {
    this.id = id;
    this.title = title;
    this.username = username;
  }

  get _id() {
    return this.id;
  }
}
