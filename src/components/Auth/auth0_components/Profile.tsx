import { useAuth0, User } from '@auth0/auth0-react';
import { Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0<User>();
  let navigate = useNavigate();

  if (!user || isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    navigate('/auth');
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Image src={user.picture} alt={user.name} />
          <Text>{user.name}</Text>
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
