import { Model } from "@vuex-orm/core";

import { getFunctions, httpsCallable } from "firebase/functions";

export default class User extends Model {
  static entity = "users";

  static fields() {
    return {
      id: this.string(""),
      email: this.string(""),
      phoneNumber: this.string(""),
      admin: this.boolean(false)
    };
  }

  static async fetchAll() {
    const functions = getFunctions();
    const getUsers = httpsCallable(functions, "app/admin/users");

    const { data } = await getUsers();
    data.forEach(user => {
      this.insert({
        data: {
          id: user.uid,
          phoneNumber: user.phoneNumber,
          email: user.email,
          admin: user.customClaims && user.customClaims.admin
        }
      });
    });
  }

  async makeAdmin(value) {
    const functions = getFunctions();
    const setAdmin = httpsCallable(
      functions,
      value ? "app/admin/add" : "app/admin/remove"
    );
    await setAdmin({ uid: this.id });
    User.fetchAll();
  }
}
