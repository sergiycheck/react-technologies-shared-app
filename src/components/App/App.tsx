import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.scss';
import { ChakraProvider } from '@chakra-ui/react';
import { Users } from '../Users/Users';
import theme from './theme';
import { Outlet, Route, Routes } from 'react-router-dom';

import { Auth } from '../Auth/custom_components/Auth';
import Profile from '../Auth/custom_components/Profile';
import { NavBar } from './NavBar';
import { GoogleClient, GoogleClientContextProvider } from '../Auth/GoogleClient';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Users />}></Route>
        <Route path="auth" element={<Auth />}></Route>
        <Route path="profile" element={<Profile />}></Route>
      </Route>
    </Routes>
  );
}

const queryClient = new QueryClient();
const googleClient = new GoogleClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <GoogleClientContextProvider client={googleClient}>
          <div className="App">
            <header className="container">
              <NavBar />
            </header>
            <main className="App-main">
              <Outlet />
            </main>
          </div>
        </GoogleClientContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
