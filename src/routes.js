import Chauffeurs from "@/components/chauffeurs/Chauffeurs.vue";
import Departs from "@/components/departs/Departs.vue";
import Facturation from "@/components/facturation/Facturation.vue";
import Journee from "@/components/journee/Journee.vue";
import Patients from "@/components/patients/Patients.vue";
import Semaine from "@/components/semaine/Semaine.vue";
import Auth from "./components/auth/Auth.vue";

const routes = [
  { path: "/", redirect: "/journee" },
  { path: "/auth", component: Auth },
  { path: "/journee", component: Journee },
  { path: "/departs", component: Departs },
  {
    path: "/series",
    component: Semaine
  },
  {
    path: "/patients",
    component: Patients
  },
  {
    path: "/chauffeurs",
    component: Chauffeurs
  },
  {
    path: "/facturation",
    component: Facturation
  }
];
export default routes;
