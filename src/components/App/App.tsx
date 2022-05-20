import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.scss';
import { ChakraProvider } from '@chakra-ui/react';
import { Users } from '../Users/Users';
import theme from './theme';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <div className="App">
          <main className="App-main">
            <Users />
          </main>
        </div>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
