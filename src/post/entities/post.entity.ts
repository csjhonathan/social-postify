export class Post {
  private title: string;
  private text: string;
  private image?: string;

  constructor(title: string, text: string, image?: string) {
    this.title = title;
    this.image = image;
    if (image !== undefined) {
      this.image = image;
    }
  }
}
