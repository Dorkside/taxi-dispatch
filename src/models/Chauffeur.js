import { Model } from "@vuex-orm/core";
import * as firebase from "firebase";
import { db } from "../store/db";
import Course from "./Course";
import Phone from "./Phone";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id"),
      deleted: this.string(""),
      order: this.number(0),
      phones: this.hasMany(Phone, "chauffeur_id"),
      newPhone: this.string(""),
      validNewPhone: this.boolean(false)
    };
  }

  static create(data = null) {
    db.collection("chauffeurs")
      .add({
        name: data.name || "Nouveau chauffeur",
        deleted: "",
        order: 0
      })
      .then(result => {
        Phone.create({
          value: data.phone,
          chauffeur_id: result.id
        });
      });
  }

  addPhone(phone) {
    Phone.create({ value: phone, chauffeur_id: this.id });
  }

  update(data) {
    db.collection("chauffeurs")
      .doc(this.id)
      .update(data);
  }

  delete() {
    Course.query()
      .where("chauffeur_id", this.$id)
      .where("deleted", "")
      .where("doneDate", "")
      .get()
      .forEach(course => {
        course.update({ chauffeur_id: firebase.firestore.FieldValue.delete() });
      });

    Phone.query()
      .where("chauffeur_id", this.$id)
      .get()
      .forEach(phone => phone.delete());

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
