import React from 'react';
import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

export function NavBar() {
  const isLoading = false;
  const isAuthenticated = false;

  let renderedAuth;

  if (isLoading) {
    renderedAuth = (
      <div>
        <BeatLoader size={8} color="white" />
      </div>
    );
  } else {
    renderedAuth = isAuthenticated ? (
      <Link as={RouterLink} to="/profile">
        hi userName
      </Link>
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
