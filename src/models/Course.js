import { Model } from "@vuex-orm/core";
import uuid from "uuid";
import { db } from "../store/db";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";
import Types from "../database/types";
import firebase from "firebase";

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
      db.collection("courses")
        .doc(change.doc.id)
        .update({
          patient_id,
          patient: firebase.firestore.FieldValue.delete()
        });
    }
  });
};
export default class Course extends Model {
  static entity = "courses";
  static refs = {};

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
      societe: this.string(""),
      isRead: this.boolean(false)
    };
  }

  static fetch(date) {
    if (!Course.refs[date]) {
      Course.refs[date] = db.collection("courses").where("date", "==", date);
      Course.refs[date].onSnapshot(function(querySnapshot) {
        subscribeToChanges(Course, querySnapshot);
      });
    }
  }

  static fetchMonth(date) {
    if (!Course.refs[date]) {
      Course.refs[date] = db
        .collection("courses")
        .where("date", ">=", `${date}-00`)
        .where("date", "<=", `${date}-32`);
      Course.refs[date].onSnapshot(function(querySnapshot) {
        subscribeToChanges(Course, querySnapshot);
      });
    }
  }

  static create(data) {
    console.log(data);
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
    let id = this.id || this.ref || uuid.v4();
    Course.insertOrUpdate({
      data: {
        ...this.$toJson(),
        ...data,
        id
      }
    });
    db.collection("courses")
      .doc(id)
      .update(data)
      .then(() => {})
      .catch(() => {
        db.collection("courses")
          .doc(id)
          .set({
            ...JSON.parse(
              JSON.stringify({
                ...this.$toJson(),
                patient_id: this.$toJson().patient && this.$toJson().patient.id,
                patient: undefined,
                isRead: data.chauffeur_id ? false : this.$toJson().isRead
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

  read() {
    db.collection("courses")
      .doc(this.id)
      .update({ isRead: true });
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
