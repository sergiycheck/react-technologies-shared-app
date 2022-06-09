import { Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGoogleWithUserClient } from '../GoogleClient';
import LogoutButton from './Logout';

const Profile = () => {
  const googleClientWithData = useGoogleWithUserClient();
  const user = googleClientWithData.currentUser!;
  const isAuthenticated = !!user;

  let navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>User profile</h1>
        </div>
        <div className="col">
          <Image src={user.pictureUrl} alt={user.firstName} />
          <Text>{user.firstName}</Text>
          <Text>{user.email}</Text>
        </div>
        <div className="col">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Profile;
