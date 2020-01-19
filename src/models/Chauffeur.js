import { Model } from "@vuex-orm/core";
import * as firebase from "firebase";
import { db } from "../store/db";
import Course from "./Course";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id"),
      deleted: this.string("")
    };
  }

  static create(data = null) {
    if (data.phone) {
      db.collection("chauffeurs")
        .doc(data.phone)
        .set({
          name: data.name || "Nouveau chauffeur",
          phone: data.phone || "",
          deleted: ""
        });
    } else {
      db.collection("chauffeurs").add({
        name: data.name || "Nouveau chauffeur",
        phone: "",
        deleted: ""
      });
    }
  }

  update(data) {
    db.collection("chauffeurs")
      .doc(this.id)
      .update(data);
  }

  delete() {
    Course.query()
      .where("chauffeur_id", this.$id)
      .get()
      .forEach(course => {
        course.update({ chauffeur_id: firebase.firestore.FieldValue.delete() });
      });
    db.collection("chauffeurs")
      .doc(this.id)
      .update({ deleted: new Date().toISOString() });
  }

  get initiales() {
    return this.name
      .split(" ")
      .map(chunk => (chunk.length > 0 ? chunk[0] : ""))
      .join("");
  }
}
