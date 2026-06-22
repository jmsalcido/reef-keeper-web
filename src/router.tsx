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

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogIndexRoute,
  articleRoute,
  privacyRoute,
  termsRoute,
  contactRoute,
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
