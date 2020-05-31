import { Model } from "@vuex-orm/core";
import { db } from "../store/db";
import Patient from "./Patient";

export default class Place extends Model {
  static entity = "places";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      order: this.number(0),
      patient_id: this.string(""),
      patient: this.hasMany(Patient, "place_id")
    };
  }

  static create(data = null) {
    db.collection("places")
      .doc(data.name)
      .set({
        name: data.name
      });
  }

  update(data) {
    db.collection("places")
      .doc(this.id)
      .update(data);
  }

  delete() {
    db.collection("places")
      .doc(this.id)
      .delete();
    Place.delete(this.id);
  }
}
