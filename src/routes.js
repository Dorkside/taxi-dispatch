import Calendar from "@/components/Calendar.vue";
import Journee from "@/components/journee/Journee.vue";
import Semaine from "@/components/semaine/Semaine.vue";

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
    path: "/patients",
    component: Semaine
  }
];
export default routes;
