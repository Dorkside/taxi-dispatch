import Journee from "@/components/journee/Journee.vue";

const routes = [
  { path: "*", redirect: "/journee" },
  { path: "/journee", component: Journee }
];
export default routes;
