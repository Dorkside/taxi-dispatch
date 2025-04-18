import Chauffeurs from "@/components/chauffeurs/Chauffeurs.vue";
import Places from "@/components/places/Places.vue";
import Departs from "@/components/departs/Departs.vue";
import Facturation from "@/components/facturation/Facturation.vue";
import Bons from "@/components/bons/Bons.vue";
import Societes from "@/components/administration/Societes.vue";
import Admins from "@/components/administration/Admins.vue";
import Categories from "@/components/administration/Categories.vue";
import Journee from "@/components/journee/Journee.vue";
import Semaine from "@/components/semaine/Semaine.vue";
import StatsPage from "@/components/Stats.vue";
import Auth from "@/components/auth/Auth.vue";

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
    path: "/chauffeurs",
    component: Chauffeurs
  },
  {
    path: "/places",
    component: Places
  },
  {
    path: "/facturation",
    component: Facturation
  },
  {
    path: "/societes",
    component: Societes
  },
  {
    path: "/categories",
    component: Categories
  },
  {
    path: "/admins",
    component: Admins
  },
  {
    path: "/stats",
    component: StatsPage
  },
  {
    path: "/bons",
    component: Bons
  }
];
export default routes;
