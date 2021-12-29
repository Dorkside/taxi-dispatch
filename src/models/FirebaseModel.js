import { Model } from "@vuex-orm/core";

import uuid from "uuid";

import { getFirestore } from "firebase/firestore";
const db = () => getFirestore();
import {
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where
} from "firebase/firestore";

export default class FirebaseModel extends Model {
  getId() {
    return this.id || this.ref || uuid.v4();
  }

  static getDoc(id) {
    return doc(db(), this.entity, id);
  }

  static getCollection() {
    return collection(db(), this.entity);
  }

  static add(data) {
    return addDoc(this.getCollection(), data);
  }

  static setDoc(id, data) {
    return setDoc(doc(db(), this.entity, id), data);
  }

  static queryFirebase(filters) {
    if (filters && filters.length) {
      return query(
        this.getCollection(),
        ...filters.map(filter => where(...filter))
      );
    }
    return query(this.getCollection);
  }

  update(data) {
    return updateDoc(doc(db(), this.constructor.entity, this.getId()), data);
  }

  static updateDoc(id, data) {
    return updateDoc(doc(db(), this.entity, id), data);
  }

  set(data) {
    return setDoc(doc(db(), this.constructor.entity, this.getId()), data);
  }

  delete() {
    return deleteDoc(doc(db(), this.constructor.entity, this.getId()));
  }
}
