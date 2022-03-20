import FirebaseModel from "./FirebaseModel";

export default class Category extends FirebaseModel {
  static entity = "categories";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      color: this.string("")
    };
  }

  static create(data = null) {
    this.add(
      data || {
        color: data.color,
        name: data.name
      }
    );
  }

  delete() {
    super.delete();
    Category.delete(this.id);
  }
}
