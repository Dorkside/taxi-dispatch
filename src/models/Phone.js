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
    db.collection("phones").add({
      value: data.value,
      deleted: ""
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
  }
}
