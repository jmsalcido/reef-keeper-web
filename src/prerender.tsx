import { renderToString } from 'react-dom/server';
import { RouterProvider } from '@tanstack/react-router';
import { makeRouter } from './router';
export { publicPaths, routeMetadata } from './seo/routeMetadata';
export async function render(path: string) {
  const router = makeRouter(path);
  await router.load();
  return renderToString(<RouterProvider router={router} />);
}
