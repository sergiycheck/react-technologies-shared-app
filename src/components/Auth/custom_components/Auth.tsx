import React from 'react';
import { Text } from '@chakra-ui/react';
import { useGoogleWithUserClient } from '../GoogleClient';
import LoginButton from './Login';
import { CredentialResponse } from 'google-one-tap';
import axios from 'axios';
import { usersUrl } from '../../shared/endpoints';
import { useMutation } from 'react-query';
import { UserAndGoogleData } from './dtos';
import { useLocation, useNavigate } from 'react-router-dom';

export type VerifyJwtTokenDto = {
  jwtGoogleToken: string;
};
const validateGoogleJwtToken = async (jwtTokenDto: VerifyJwtTokenDto) => {
  const result = await axios.post<UserAndGoogleData>(
    `${usersUrl}/verify-google-jwt-token`,
    jwtTokenDto,
  );
  return result.data;
};

export type StateOfLocationType = Location & { from: Location };

//https://developers.google.com/identity/gsi/web/guides/display-button
export function Auth() {
  const googleClientWithData = useGoogleWithUserClient();

  const navigate = useNavigate();
  const location = useLocation();

  const stateOfLocation = location.state as StateOfLocationType;
  const from = stateOfLocation?.from?.pathname || '/';

  const verifyJwtGoogleMutation = useMutation(validateGoogleJwtToken, {
    onSuccess: (userData) => {
      //invalidate tags
      googleClientWithData.setCurrentUser(userData);
      navigate(from, { replace: true });
    },
  });

  const handleCredentialResponse = React.useCallback(
    async (response: CredentialResponse) => {
      console.log('Encoded JWT ID token: ' + response.credential);

      await verifyJwtGoogleMutation.mutateAsync({
        jwtGoogleToken: response.credential,
      });
    },
    [verifyJwtGoogleMutation],
  );

  //https://developers.google.com/identity/gsi/web/reference/js-reference
  const renderButtonCallback = React.useCallback(() => {
    if (googleClientWithData.googleClient.gcd.isInitialized) {
      googleClientWithData.googleClient.gcd.google.accounts.id.renderButton(
        document.getElementById('buttonAccountLoginGoogle')!,
        { theme: 'outline', size: 'large' },
      );
    }
  }, [googleClientWithData]);

  React.useLayoutEffect(() => {
    renderButtonCallback();
  }, [renderButtonCallback]);

  const initGoogleAccountRenderButtonLoginCallback = React.useCallback(() => {
    googleClientWithData.googleClient.initGoogleAccountId({
      callback: handleCredentialResponse,
    });
    renderButtonCallback();
    googleClientWithData.googleClient.gcd.google.accounts.id.prompt();
  }, [googleClientWithData, renderButtonCallback, handleCredentialResponse]);

  React.useEffect(() => {
    function initializeGoogleDataRenderComponentsIfPageWasLoaded() {
      initGoogleAccountRenderButtonLoginCallback();
    }

    const docIsLoaded = !!googleClientWithData.isDocLoaded;
    const googleClientWasNotInitialized = !googleClientWithData.googleClient.gcd.isInitialized;
    if (docIsLoaded && googleClientWasNotInitialized) {
      initializeGoogleDataRenderComponentsIfPageWasLoaded();
    }
  }, [googleClientWithData, initGoogleAccountRenderButtonLoginCallback]);

  React.useLayoutEffect(() => {
    const onWindowLoadHandler = () => {
      console.log('onload handlers from userLayoutEffect onWindowLoadHandler');

      initGoogleAccountRenderButtonLoginCallback();
    };

    window.addEventListener('load', onWindowLoadHandler);
    return () => {
      window.removeEventListener('load', onWindowLoadHandler);
    };
  }, [initGoogleAccountRenderButtonLoginCallback]);

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
