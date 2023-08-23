export class Publication {
  private mediaId: number;
  private postId: number;
  private date: string;

  constructor(mediaId: number, postId: number, date: string) {
    this.mediaId = mediaId;
    this.postId = postId;
    this.date = date;
  }

  // get _id() {
  //   return this.id;
  // }
  // get _date() {
  //   return this.date;
  // }

  // set _mediaId(mediaId: number) {
  //   this.mediaId = mediaId;
  // }

  // set _postId(postId: number) {
  //   this.postId = postId;
  // }

  // set _date(date: string) {
  //   this.date = date;
  // }
}
