import React from 'react';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { UserAndGoogleData } from './custom_components/dtos';
import { useMutation } from 'react-query';
import axios from 'axios';
import { usersUrl } from '../shared/endpoints';

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

  initGoogleAccountId({ callback }: { callback: (response: CredentialResponse) => void }) {
    this.gcd.google.accounts.id.initialize({
      client_id: this.gcd.google_id,
      auto_select: true,
      cancel_on_tap_outside: false,
      callback,
    });
    this.gcd.isInitialized = true;
  }
}

//context data changes forces component re-renders

export const GoogleClientWithUserContext = React.createContext<{
  isDocLoaded: boolean;
  setDocLoaded: React.Dispatch<React.SetStateAction<boolean>>;

  googleClient: GoogleClient;
  currentUser: UserAndGoogleData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAndGoogleData | null>>;
  signout: (callback: VoidFunction) => void;
}>(null!);

export const useGoogleWithUserClient = () => {
  const googleClient = React.useContext(GoogleClientWithUserContext);
  return googleClient;
};

const signOutRequest = async (userId: string) => {
  const urlDeleteParams = new URLSearchParams();
  urlDeleteParams.set('uId', userId);
  const deleteParams = urlDeleteParams.toString();
  const result = await axios.delete<{ message: string; userId: string }>(
    `${usersUrl}/logout?${deleteParams}`,
  );
  return result.data;
};

export function GoogleClientWithUserContextProvider({
  client,
  children,
}: {
  client: GoogleClient;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = React.useState<UserAndGoogleData | null>(null);
  const [isDocLoaded, setDocLoaded] = React.useState(false);

  const singOutMutation = useMutation(signOutRequest, {
    onSuccess: (data) => {},
  });

  const signout = async (callback: VoidFunction) => {
    if (!currentUser) return;
    await singOutMutation.mutateAsync(currentUser?.id);
    setCurrentUser(null);
    callback();
  };

  const passedValue = {
    isDocLoaded,
    setDocLoaded,
    googleClient: client,
    currentUser,
    setCurrentUser,
    signout,
  };

  return (
    <GoogleClientWithUserContext.Provider value={passedValue}>
      {children}
    </GoogleClientWithUserContext.Provider>
  );
}
