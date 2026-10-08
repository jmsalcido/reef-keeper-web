import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { Landing } from './pages/Landing';
import { BlogIndex } from './pages/BlogIndex';
import { Article } from './pages/Article';
import { Privacy, Terms } from './pages/Legal';
import { Contact } from './pages/Contact';
import { WaterChangeCalculator } from './pages/WaterChangeCalculator';
import { AquariumCycleChecker } from './pages/AquariumCycleChecker';
import { MaintenanceScheduleGenerator } from './pages/MaintenanceScheduleGenerator';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const blogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogIndex,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: Article,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: Privacy,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: Terms,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

const waterChangeCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/water-change-calculator',
  component: WaterChangeCalculator,
});

const aquariumCycleCheckerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/aquarium-cycle-checker',
  component: AquariumCycleChecker,
});

const maintenanceScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/aquarium-maintenance-schedule',
  component: MaintenanceScheduleGenerator,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogIndexRoute,
  articleRoute,
  privacyRoute,
  termsRoute,
  contactRoute,
  waterChangeCalculatorRoute,
  aquariumCycleCheckerRoute,
  maintenanceScheduleRoute,
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
