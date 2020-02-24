import { Model } from "@vuex-orm/core";
import { db } from "../store/db";
import Chauffeur from "./Chauffeur";

export default class Phone extends Model {
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
    db.collection("phones")
      .doc(data.value)
      .set({
        chauffeur_id: data.chauffeur_id,
        value: data.value
      });
  }

  update(data) {
    db.collection("phones")
      .doc(this.id)
      .update(data);
  }

  delete() {
    db.collection("phones")
      .doc(this.id)
      .delete();
    Phone.delete(this.id);
  }
}
