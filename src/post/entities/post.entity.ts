export class Post {
  private id: number;
  private title: string;
  private text: string;
  private image?: string;

  constructor(id: number, title: string, text: string, image?: string) {
    this.id = id;
    this.title = title;
    this.image = image;
    if (image !== undefined) {
      this.image = image;
    }
  }

  get _id() {
    return this.id;
  }

  set _title(title: string) {
    this.title = title;
  }
  set _text(text: string) {
    this.text = text;
  }
  set _image(image: string) {
    this.image = image;
  }
}
