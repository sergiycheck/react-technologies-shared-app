import React from 'react';
import { Text } from '@chakra-ui/react';
import { useGoogleClient } from '../GoogleClient';
import LoginButton from './Login';
import { CredentialResponse } from 'google-one-tap';
import axios from 'axios';
import { usersUrl } from '../../shared/endpoints';
import { useMutation } from 'react-query';

export type VerifyJwtTokenDto = {
  jwtGoogleToken: string;
};
const validateGoogleJwtToken = async (jwtTokenDto: VerifyJwtTokenDto) => {
  await axios.post(`${usersUrl}/verify-google-jwt-token`, jwtTokenDto);
};

//https://developers.google.com/identity/gsi/web/guides/display-button
export function Auth() {
  const googleClient = useGoogleClient();

  const verifyJwtGoogleMutation = useMutation(validateGoogleJwtToken, {
    onSuccess: () => {
      //invalidate tags
      console.log('jwt google invalidation success');
    },
  });

  const handleCredentialResponse = async (response: CredentialResponse) => {
    //https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions

    //https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //https://jwt.io/

    console.log('Encoded JWT ID token: ' + response.credential);

    await verifyJwtGoogleMutation.mutateAsync({
      jwtGoogleToken: response.credential,
    });
  };

  const handleNativeCallback = (response: any) => {
    //not invoked
    console.log('Password credential', response);
  };

  //https://developers.google.com/identity/gsi/web/reference/js-reference
  const renderButtonCallback = React.useCallback(() => {
    if (googleClient.gcd.isInitialized) {
      googleClient.gcd.google.accounts.id.renderButton(
        document.getElementById('buttonAccountLoginGoogle')!,
        { theme: 'outline', size: 'large' },
      );
    }
  }, [googleClient]);

  React.useLayoutEffect(() => {
    renderButtonCallback();
  }, [renderButtonCallback]);

  React.useLayoutEffect(() => {
    const onWindowLoadHandler = () => {
      googleClient.initGoogleAccountId({
        callback: handleCredentialResponse,
        native_callback: handleNativeCallback,
      });

      renderButtonCallback();

      googleClient.gcd.google.accounts.id.prompt();
    };

    window.addEventListener('load', onWindowLoadHandler);

    return () => {
      window.removeEventListener('load', onWindowLoadHandler);
    };
  }, [googleClient, renderButtonCallback]);

  //TODO: disable auto sign in on user sign out
  // const button = document.getElementById(‘signout_button’);
  // button.onclick = () => {
  //   google.accounts.id.disableAutoSelect();
  // }

  return (
    <div className="container">
      <Text fontSize="3xl">Auth Page</Text>
      <div className="row justify-content-center">
        <div className="col-6">
          <LoginButton></LoginButton>
        </div>
        <div className="col-6">
          {/* https://developers.google.com/identity/gsi/web/reference/html-reference#element_with_class_g_id_signin */}
          <div id="buttonAccountLoginGoogle"></div>
        </div>
      </div>
    </div>
  );
}
