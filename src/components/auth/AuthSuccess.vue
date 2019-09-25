<template>
  <div>
    <h1>Signup succeeded</h1>
    <button @click="logOut">Log out</button>
    <hr />
    <p>{{ name }}</p>
    <p>{{ email }}</p>
    <p>{{ userId }}</p>
    <hr />
    <pre>{{ user }}</pre>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "AuthSuccess",
  data() {
    return {
      photo: "",
      userId: "",
      name: "",
      email: "",
      user: {}
    };
  },
  created() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.name = this.user.displayName;
      this.email = this.user.email;
      this.photo = this.user.photoURL;
      this.userId = this.user.uid;
    }
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    }
  }
};
</script>
