import { Button } from '@chakra-ui/react';
import React from 'react';

const LogoutButton = () => {
  return (
    //https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out
    <Button colorScheme="teal" className="g_id_signout" onClick={() => console.log('loggin out')}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
