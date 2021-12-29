import FirebaseModel from "./FirebaseModel";

import Chauffeur from "./Chauffeur";

export default class Phone extends FirebaseModel {
  static entity = "phones";

  static fields() {
    return {
      id: this.string(""),
      value: this.string(""),
      chauffeur_id: this.string(""),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id")
    };
  }

  static create(data = null) {
    this.setDoc(data.value, {
      chauffeur_id: data.chauffeur_id,
      value: data.value
    });
  }

  delete() {
    super.delete();
    Phone.delete(this.id);
  }
}
