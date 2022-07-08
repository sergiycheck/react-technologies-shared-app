import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGoogleWithUserClient } from '../GoogleClient';
import { useNavigate } from 'react-router-dom';

//https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out

const LogoutButton = () => {
  const googleClientWithData = useGoogleWithUserClient();
  let navigate = useNavigate();

  return (
    <Button
      colorScheme="teal"
      className="g_id_signout"
      onClick={() =>
        googleClientWithData.signout(() => {
          googleClientWithData.googleClient.gcd.google.accounts.id.disableAutoSelect();
          navigate('/auth');
        })
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
