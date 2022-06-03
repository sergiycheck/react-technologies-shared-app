import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';
import React from 'react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button colorScheme="teal" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
};

export default LoginButton;
