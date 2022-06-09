import React from 'react';
import { Link, SimpleGrid } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useGoogleWithUserClient } from '../Auth/GoogleClient';
import { Image } from '@chakra-ui/react';

export function NavBar() {
  const googleClientWithData = useGoogleWithUserClient();

  const isLoading = false;
  const isAuthenticated = !!googleClientWithData?.currentUser;

  React.useEffect(() => {
    const onWindowLoadHandler = (e: Event) => {
      googleClientWithData.setDocLoaded(true);
    };

    window.addEventListener('load', onWindowLoadHandler);

    return () => {
      window.removeEventListener('load', onWindowLoadHandler);
    };
  }, [googleClientWithData]);

  let renderedAuth;
  if (isLoading) {
    renderedAuth = (
      <div>
        <BeatLoader size={8} color="white" />
      </div>
    );
  } else {
    renderedAuth = isAuthenticated ? (
      <SimpleGrid alignItems="center" columns={2} spacing="10">
        <Link as={RouterLink} to="/profile">
          hi {googleClientWithData?.currentUser?.firstName}
        </Link>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={googleClientWithData?.currentUser?.pictureUrl}
          alt={`${googleClientWithData?.currentUser?.firstName} ${googleClientWithData?.currentUser?.lastName}`}
        ></Image>
      </SimpleGrid>
    ) : (
      <Link as={RouterLink} to="/auth">
        Login/Register
      </Link>
    );
  }

  return (
    <div className="row">
      <div className="row">
        <div className="col-auto">
          <Link as={RouterLink} to="/">
            Home
          </Link>
        </div>
        <div className="col-auto ms-auto">{renderedAuth}</div>
      </div>
    </div>
  );
}
