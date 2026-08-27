import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "../pages/Login.vue";
import RegisterComponent from "../pages/RegisterComponent.vue";
import Tasks from "../pages/Tasks/Tasks.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterComponent,
    },
    {
      path: "/task",
      name: "task",
      component: Tasks,
    },
  ],
});

export default router;
