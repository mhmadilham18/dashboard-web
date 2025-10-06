// src/scripts/routes/routes.js

import LoginPage from "../pages/login/login-page.js";
import HomePage from "../pages/home/home-page.js";
import FoodsPage from "../pages/food/food-page.js";
import AddFoodPage from "../pages/add-food/add-food-page.js";
import ActivitiesPage from "../pages/activities/activities-page.js";
import AddActivityPage from "../pages/add-activities/add-activities-page.js";
import ArticlesPage from "../pages/article/articles-page.js";
import AddArticlePage from "../pages/add-article/add-article-page.js";
import EventsPage from "../pages/event/events-page.js";
import AddEventPage from "../pages/add-event/add-event-page.js";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth.js";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/home": () => checkAuthenticatedRoute(new HomePage()),

  "/foods": () => checkAuthenticatedRoute(new FoodsPage()),
  "/foods/add": () => checkAuthenticatedRoute(new AddFoodPage()),
  "/foods/:id": () => checkAuthenticatedRoute(new AddFoodPage()),

  "/activities": () => checkAuthenticatedRoute(new ActivitiesPage()),
  "/activities/add": () => checkAuthenticatedRoute(new AddActivityPage()),
  "/activities/:id": () => checkAuthenticatedRoute(new AddActivityPage()),

  "/articles": () => checkAuthenticatedRoute(new ArticlesPage()),
  "/articles/add": () => checkAuthenticatedRoute(new AddArticlePage()),
  "/articles/:id": () => checkAuthenticatedRoute(new AddArticlePage()),

  "/events": () => checkAuthenticatedRoute(new EventsPage()),
  "/events/add": () => checkAuthenticatedRoute(new AddEventPage()),
  "/events/:id": () => checkAuthenticatedRoute(new AddEventPage()),
};

export default routes;
