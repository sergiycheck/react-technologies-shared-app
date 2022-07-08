import { Text } from '@chakra-ui/react';
import LoginButton from './Login';

export function Auth() {
  return (
    <div className="container">
      <Text fontSize="3xl">Auth Page</Text>
      <div className="row">
        <div className="col">
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  );
}
