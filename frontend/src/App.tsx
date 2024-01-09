import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import { Auth0Provider } from '@auth0/auth0-react';
import TaskBoard from './pages/TaskBoard';
import { AuthenticationGuard } from './components/AuthenticationGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticationGuard component={TaskBoard} />
  }
]);

const providerConfig = {
  clientId: 'HNceHDGMSTKSeJMYMC464kCOhtjfphIN',
  domain: 'https://dev-ncfqflyrzqw2pjpl.us.auth0.com',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://dev-ncfqflyrzqw2pjpl.us.auth0.com/api/v2/'
  }
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://${process.env.BACK_HOST}:${process.env.BACK_PORT}/trpc`
        })
      ]
    })
  );

  return (
    <Auth0Provider {...providerConfig}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </Auth0Provider>
  );
}
