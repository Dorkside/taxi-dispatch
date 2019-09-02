import { Model } from "@vuex-orm/core";
import Course from "./Course";
import v4 from "uuid";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.string(v4()),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id")
    };
  }

  static methodConf = {
    http: {
      url: "/chauffeurs"
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
          url: "",
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
}
