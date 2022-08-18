import Chauffeur from "./Chauffeur";
import Patient from "./Patient";
import Category from "./Category";
import Types from "../database/types";

import { deleteField, onSnapshot } from "firebase/firestore";
import FirebaseModel from "./FirebaseModel";

const subscribeToChanges = (Model, querySnapshot) => {
  const docChanges = querySnapshot.docChanges();
  Model.insertOrUpdate({
    data: docChanges
      .filter(change => change.type === "added")
      .map(change => ({
        ...change.doc.data(),
        id: change.doc.id
      }))
  });
  Model.insertOrUpdate({
    data: docChanges
      .filter(change => change.type === "modified")
      .map(change => ({
        ...change.doc.data(),
        id: change.doc.id
      }))
  });
  Model.delete({
    data: docChanges
      .filter(change => change.type === "removed")
      .map(change => ({
        id: change.doc.id
      }))
  });

  docChanges.forEach(change => {
    if (change.doc.data().patient) {
      const patient_id = change.doc.data().patient.id;
      Model.updateDoc(change.doc.id, {
        patient_id,
        patient: deleteField()
      });
    }
  });
};
export default class Course extends FirebaseModel {
  static entity = "courses";
  static refs = {};

  static fields() {
    return {
      id: this.string(),
      ref: this.string(),
      chauffeur_id: this.string(),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      type: this.string("Consultation"),
      category: this.belongsTo(Category, "type"),
      patient_id: this.string(),
      patient: this.belongsTo(Patient, "patient_id"),
      date: this.string(new Date().toISOString().substring(0, 10)),
      time: this.string(""),
      priority: this.number(Infinity),
      generated: this.boolean(false),
      deleted: this.string(""),
      doneDate: this.string(""),
      societe: this.string(""),
      isRead: this.boolean(false),
      overlap: this.number(0),
      passageRecupere: this.boolean(false),
      passageControle: this.boolean(false),
      transportRecupere: this.boolean(false),
      transportControle: this.boolean(false)
    };
  }

  static fetch(date, chauffeur_id) {
    if (!Course.refs[date]) {
      let filters = [["date", "==", date]];
      if (chauffeur_id) {
        filters.push(["chauffeur_id", "==", chauffeur_id]);
      }
      Course.refs[date] = this.queryFirebase(filters);
      onSnapshot(Course.refs[date], function(querySnapshot) {
        subscribeToChanges(Course, querySnapshot);
      });
    }
  }

  static fetchMonth(date) {
    if (!Course.refs[date]) {
      Course.refs[date] = this.queryFirebase([
        ["date", ">=", `${date}-00`],
        ["date", "<=", `${date}-32`]
      ]);
      onSnapshot(Course.refs[date], function(querySnapshot) {
        subscribeToChanges(Course, querySnapshot);
      });
    }
  }

  static create(data) {
    this.add(
      data || {
        date: new Date().toISOString().substring(0, 10),
        deleted: "",
        doneDate: ""
      }
    );
  }

  update(data) {
    Course.insertOrUpdate({
      data: {
        ...this.$toJson(),
        ...data,
        id: this.getId()
      }
    });
    super.update(data).catch(() => {
      this.set({
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
    if (this.id) {
      this.update({ deleted: new Date().toISOString() });
    } else {
      if (!skipCreate) {
        this.set({
          ...JSON.parse(JSON.stringify(this.$toJson())),
          deleted: new Date().toISOString()
        });
      } else {
        Course.delete(this);
      }
    }
  }

  undelete() {
    super.update({ deleted: "" });
  }

  read() {
    super.update({ isRead: true });
  }

  done() {
    super.update({ doneDate: new Date().toISOString() });
  }

  undone() {
    super.update({ doneDate: "" });
  }

  recupererTransport(value) {
    if (value) {
      super.update({ transportRecupere: true });
    } else {
      super.update({ transportRecupere: false, transportControle: false });
    }
  }

  controlerTransport(value) {
    if (value) {
      super.update({ transportRecupere: true, transportControle: true });
    } else {
      super.update({ transportControle: false });
    }
  }

  recupererPassage(value) {
    if (value) {
      super.update({ passageRecupere: true });
    } else {
      super.update({ passageRecupere: false, passageControle: false });
    }
  }

  controlerPassage(value) {
    if (value) {
      super.update({ passageRecupere: true, passageControle: true });
    } else {
      super.update({ passageControle: false });
    }
  }

  get fullRef() {
    return `${this.ref}-${this.id}`;
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
      return Types[this.type].color;
    } else if (this.patient) {
      return this.patient.color;
    } else {
      return "grey";
    }
  }

  get shortType() {
    return Types[this.type].shortName;
  }
}
