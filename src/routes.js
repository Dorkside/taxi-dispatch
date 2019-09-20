import Calendar from "@/components/Calendar.vue";
import Annuaire from "@/components/Annuaire.vue";
import Journee from "@/components/journee/Journee.vue";
import Semaine from "@/components/semaine/Semaine.vue";
import Patients from "@/components/patients/Patients.vue";
import Chauffeurs from "@/components/chauffeurs/Chauffeurs.vue";

const routes = [
  { path: "*", redirect: "/cal" },
  {
    path: "/cal",
    component: Calendar,
    children: [
      { path: "", redirect: "journee" },
      { path: "journee", component: Journee }
    ]
  },
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
