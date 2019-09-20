import { Model } from "@vuex-orm/core";
import Course from "./Course";
import v4 from "uuid";

export default class Patient extends Model {
  static entity = "patients";

  static fields() {
    return {
      id: this.string(v4()),
      name: this.string(""),
      type: this.string("Consultation"),
      courses: this.hasMany(Course, "patient_id"),
      lundi: this.string(""),
      mardi: this.string(""),
      mercredi: this.string(""),
      jeudi: this.string(""),
      vendredi: this.string(""),
      samedi: this.string("")
    };
  }

  static methodConf = {
    http: {
      url: "/patients"
    },
    methods: {
      $fetch: {
        name: "fetch",
        http: {
          url: "",
          method: "get"
        }
      },
      $get: {
        name: "get",
        http: {
          url: "/:id",
          method: "get"
        }
      },
      $create: {
        name: "create",
        http: {
          url: "/:id",
          method: "post"
        }
      },
      $update: {
        name: "update",
        http: {
          url: "/:id",
          method: "patch"
        }
      },
      $delete: {
        name: "delete",
        http: {
          url: "/:id",
          method: "delete"
        }
      }
    }
  };

  get color() {
    switch (this.type) {
      case "Dialyse":
        return "blue";
      case "HDJ":
        return "red";
      case "Kiné / Rééducation":
        return "black";
      case "Consultation":
        return "green";
      default:
        return "grey";
    }
  }

  get shortType() {
    switch (this.type) {
      case "Dialyse":
        return "D";
      case "HDJ":
        return "HDJ";
      case "Kiné / Rééducation":
        return "K";
      case "Consultation":
        return "C";
      default:
        return "?";
    }
  }

  prettyTime(day) {
    return this[day.toLowerCase()] || "--:--";
  }
}
