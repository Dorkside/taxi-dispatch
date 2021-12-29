import FirebaseModel from "./FirebaseModel";

import Patient from "./Patient";

export default class Place extends FirebaseModel {
  static entity = "places";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      order: this.number(0),
      patient_id: this.string(""),
      patient: this.hasMany(Patient, "place_id"),
      adresse: this.string("")
    };
  }

  static create(data = null) {
    this.add({
      name: data.name,
      adresse: data.adresse
    });
  }

  delete() {
    super.delete();
    Place.delete(this.id);
  }
}
