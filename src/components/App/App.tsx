import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.scss';
import { ChakraProvider } from '@chakra-ui/react';
import { Users } from '../Users/Users';
import theme from './theme';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { Auth } from '../Auth/custom_components/Auth';
import Profile from '../Auth/custom_components/Profile';
import { NavBar } from './NavBar';
import {
  GoogleClient,
  GoogleClientWithUserContextProvider,
  useGoogleWithUserClient,
} from '../Auth/GoogleClient';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Users />}></Route>
        <Route path="auth" element={<Auth />}></Route>
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        ></Route>
      </Route>
    </Routes>
  );
}

const queryClient = new QueryClient();
const googleClientWithUser = new GoogleClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <GoogleClientWithUserContextProvider client={googleClientWithUser}>
          <div className="App">
            <header className="container">
              <NavBar />
            </header>
            <main className="App-main">
              <Outlet />
            </main>
          </div>
        </GoogleClientWithUserContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const googleClientWithData = useGoogleWithUserClient();
  const location = useLocation();

  if (!googleClientWithData?.currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
