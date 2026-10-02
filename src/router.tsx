import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
  createMemoryHistory,
} from '@tanstack/react-router';
import { SeoHead } from './seo/SeoHead';
import { routeMetadata } from './seo/routeMetadata';
import { Landing } from './pages/Landing';
import { BlogIndex } from './pages/BlogIndex';
import { Article } from './pages/Article';
import { Privacy, Terms } from './pages/Legal';
import { FirstAquarium } from './pages/FirstAquarium';
import { TankDemo } from './pages/TankDemo';
import { Contact } from './pages/Contact';

const rootRoute = createRootRoute({
  component: function Root() {
    const pathname = useLocation({ select: location => location.pathname });
    return <><SeoHead {...routeMetadata(pathname)} /><Outlet /></>;
  },
  notFoundComponent: () => <main style={{ padding: 48 }}><h1>Page not found</h1><a href="/">Return to Reef Keeper</a></main>,
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

const firstAquariumRoute = createRoute({ getParentRoute: () => rootRoute, path: '/first-aquarium', component: FirstAquarium });

const demoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/demo', component: TankDemo });

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogIndexRoute,
  articleRoute,
  privacyRoute,
  termsRoute,
  contactRoute,
  firstAquariumRoute,
  demoRoute,
]);

export const makeRouter = (path?: string) => createRouter({
  history: path ? createMemoryHistory({ initialEntries: [path] }) : undefined,
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
});

export const router = makeRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
