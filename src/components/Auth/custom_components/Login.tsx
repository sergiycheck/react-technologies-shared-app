import { Button } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';

// export function useUsers() {
//   return useQuery('users', async (): Promise<User[]> => {
//     const { data } = await axios.get(usersUrl);
//     return data;
//   });
// }

const LoginButton = () => {
  return (
    <Button colorScheme="teal" onClick={() => console.log('logging in')}>
      Log In
    </Button>
  );
};

export default LoginButton;
