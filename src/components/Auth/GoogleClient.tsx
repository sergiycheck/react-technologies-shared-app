import React from 'react';
import { CredentialResponse } from 'google-one-tap';
import { UserAndGoogleData } from './custom_components/dtos';

declare global {
  interface Window {
    account: typeof import('google-one-tap');
  }
}

type GoogleClientData = {
  google: typeof window.google;
  google_id: string;
  client_secret: string;
  redirect_url: string;
  isInitialized: boolean;
};

export class GoogleClient {
  public gcd: GoogleClientData;

  constructor() {
    this.gcd = {
      google: window.google,
      google_id: process.env.REACT_APP_CLIENT_ID!,
      client_secret: process.env.REACT_APP_CLIENT_SECRET!,
      redirect_url: process.env.REACT_APP_REDIRECT_URL!,
      isInitialized: false,
    };
  }

  initGoogleAccountId({
    callback,
    native_callback,
  }: {
    callback: (response: CredentialResponse) => void;
    native_callback: (response?: any) => void;
  }) {
    this.gcd.google.accounts.id.initialize({
      client_id: this.gcd.google_id,
      auto_select: true,
      cancel_on_tap_outside: false,
      callback,
      native_callback,
    });
    this.gcd.isInitialized = true;
  }
}

export const GoogleClientContext = React.createContext<{
  googleClient: GoogleClient;
  currentUser: UserAndGoogleData | null;
  signin: (user: UserAndGoogleData, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}>(null!);

export const useGoogleClient = () => {
  const googleClient = React.useContext(GoogleClientContext);
  return googleClient;
};

export function GoogleClientContextProvider({
  client,
  children,
}: {
  client: GoogleClient;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = React.useState<UserAndGoogleData | null>(null);

  const signin = (user: UserAndGoogleData, callback: VoidFunction) => {
    return;
  };

  const passedValue = {
    googleClient: client,
    currentUser,
    setCurrentUser,
  };

  return (
    <GoogleClientContext.Provider value={passedValue}>{children}</GoogleClientContext.Provider>
  );
}
