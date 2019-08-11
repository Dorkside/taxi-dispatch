import Calendar from "@/components/Calendar.vue";
import Journee from "@/components/journee/Journee.vue";

const routes = [
  { path: "*", redirect: "/cal" },
  {
    path: "/cal",
    component: Calendar,
    children: [
      { path: "", redirect: "journee" },
      { path: "journee", component: Journee }
    ]
  }
];
export default routes;
