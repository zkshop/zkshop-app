import { ThemeProvider } from '@3shop/ui';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@3shop/admin-store';
import { ApolloProvider, createApolloClient } from '@3shop/apollo';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { CenterProvider } from '@center-inc/react';
import { envVars } from '@3shop/config';

type AppProviderProps = {
  children: React.ReactNode;
};

const apolloClient = createApolloClient();

export const AppProvider = ({ children }: AppProviderProps) => (
  <React.StrictMode>
    <CookiesProvider>
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <CenterProvider
            apiKey={envVars.SECRET_CENTER}
            mode={envVars.NODE_ENV as 'development' | 'production'}
          >
            <BrowserRouter>
              <ThemeProvider>{children}</ThemeProvider>
            </BrowserRouter>
          </CenterProvider>
        </ReduxProvider>
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>
);
