import { Model } from "@vuex-orm/core";
import uuid from "uuid";
import { db } from "../store/db";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";

export default class Course extends Model {
  static entity = "courses";

  static fields() {
    return {
      id: this.string(),
      ref: this.string(),
      chauffeur_id: this.string(),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      type: this.string("Consultation"),
      patient_id: this.string(),
      patient: this.belongsTo(Patient, "patient_id"),
      date: this.string(new Date().toISOString().substring(0, 10)),
      time: this.string(""),
      priority: this.number(Infinity),
      generated: this.boolean(false),
      deleted: this.string(""),
      doneDate: this.string(""),
      societe: this.string("")
    };
  }

  static create(data) {
    db.collection("courses")
      .doc(this.ref || uuid.v4())
      .set(
        data || {
          date: new Date().toISOString().substring(0, 10),
          deleted: "",
          doneDate: ""
        }
      );
  }

  update(data) {
    db.collection("courses")
      .doc(this.id || this.ref || uuid.v4())
      .update(data)
      .then(() => {})
      .catch(error => {
        db.collection("courses")
          .doc(this.ref || uuid.v4())
          .set({
            ...JSON.parse(
              JSON.stringify({
                ...this.$toJson(),
                patient_id: this.$toJson().patient && this.$toJson().patient.id,
                patient: undefined
              })
            ),
            ...data
          });
      });
  }

  delete(skipCreate = false) {
    console.log(skipCreate);
    if (this.id) {
      db.collection("courses")
        .doc(this.id)
        .update({ deleted: new Date().toISOString() });
    } else {
      console.log("INSERT");
      if (!skipCreate) {
        db.collection("courses")
          .doc(this.ref || uuid.v4())
          .set({
            ...JSON.parse(JSON.stringify(this.$toJson())),
            deleted: new Date().toISOString()
          });
      } else {
        Course.delete(this);
      }
    }
  }

  undelete() {
    db.collection("courses")
      .doc(this.id)
      .update({ deleted: "" });
  }

  done() {
    db.collection("courses")
      .doc(this.id)
      .update({ doneDate: new Date().toISOString() });
  }

  undone() {
    db.collection("courses")
      .doc(this.id)
      .update({ doneDate: "" });
  }

  get direction() {
    if (this.ref) {
      let _ref = this.ref.split(".");
      return _ref[_ref.length - 1];
    }
    return "";
  }

  get prettyDay() {
    return new Date(this.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  get prettyTime() {
    return this.time || "--:--";
  }

  get color() {
    if (this.type) {
      switch (this.type) {
        case "Dialyse":
          return "CornflowerBlue";
        case "HDJ":
          return "Tomato";
        case "Kiné / Rééducation":
          return "grey";
        case "Consultation":
          return "ForestGreen";
        case "Chimiothérapie":
          return "MediumOrchid";
        case "Sortie d'hôpital":
          return "orange";
        default:
          return "grey";
      }
    } else if (this.patient) {
      return this.patient.color;
    } else {
      return "grey";
    }
  }
}
