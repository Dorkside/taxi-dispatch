import Calendar from "@/components/Calendar.vue";
import Annuaire from "@/components/Annuaire.vue";
import Journee from "@/components/journee/Journee.vue";
import Departs from "@/components/departs/Departs.vue";
import Semaine from "@/components/semaine/Semaine.vue";
import Patients from "@/components/patients/Patients.vue";
import Chauffeurs from "@/components/chauffeurs/Chauffeurs.vue";

import Auth from "./components/auth/Auth.vue";
import AuthSuccess from "./components/auth/AuthSuccess.vue";

const routes = [
  { path: "/", component: Auth },
  { path: "/auth", component: Auth },
  { path: "/success", component: AuthSuccess },
  {
    path: "/cal",
    component: Calendar,
    children: [
      { path: "", redirect: "journee" },
      { path: "journee", component: Journee }
    ]
  },
  { path: "/departs", component: Departs },
  {
    path: "/series",
    component: Semaine
  },
  {
    path: "/annuaire",
    component: Annuaire,
    children: [
      { path: "", redirect: "patients" },
      {
        path: "patients",
        component: Patients
      },
      {
        path: "chauffeurs",
        component: Chauffeurs
      }
    ]
  }
];
export default routes;
