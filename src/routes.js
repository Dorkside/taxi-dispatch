import Calendar from "@/components/Calendar.vue";
import Journee from "@/components/journee/Journee.vue";

const routes = [
  {
    path: "/",
    component: Calendar,
    children: [{ path: "journee", component: Journee }]
  }
];
export default routes;
