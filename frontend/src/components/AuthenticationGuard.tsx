import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export const AuthenticationGuard = ({ component }: any) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <p>You need to login</p>
        <Link
          to="/"
          onClick={
            !isAuthenticated
              ? () =>
                  loginWithRedirect({
                    authorizationParams: {
                      redirect_uri: `${window.location.origin}/`
                    }
                  })
              : undefined
          }
        >
          Login
        </Link>
      </div>
    )
  });

  return <Component />;
};
