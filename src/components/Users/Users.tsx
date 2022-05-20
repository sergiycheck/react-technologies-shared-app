import axios from 'axios';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { TimeAgo } from '../shared/TimeAgo';
import { PublicFile, User } from '../types';
import { Button, Fade, Image, Stack } from '@chakra-ui/react';
import AddUser from './addUser';
import { BeatLoader } from 'react-spinners';

export function useUsers() {
  return useQuery('users', async (): Promise<User[]> => {
    const { data } = await axios.get('http://localhost:3000/users');
    return data;
  });
}

export function Users() {
  const { status, data, error, isFetching } = useUsers();

  return (
    <div className="container">
      <h2>Users</h2>
      <div className="row gap-4">
        <div className="col-8">
          {status === 'loading' ? (
            'Loading'
          ) : error instanceof Error ? (
            <span>Error: {error.message}</span>
          ) : (
            <>
              {data?.map((user) => (
                <div key={user.id} className="col-12">
                  <UserExcerpt user={user} />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="col-4">
          <AddUser />
        </div>
      </div>
    </div>
  );
}

const deleteUserRequest = async (deleteReqParams: { uId: string }): Promise<void> => {
  const urlSearchParams = new URLSearchParams();
  Object.entries(deleteReqParams).forEach(([key, val]) => {
    urlSearchParams.append(key, val);
  });
  const targetUrl = `http://localhost:3000/users/one?`.concat(urlSearchParams.toString());
  await axios.delete(targetUrl);
};

export function UserExcerpt({ user }: { user: User }) {
  const min = 0;
  const max = React.useMemo(() => user?.photos?.length! - 1, [user?.photos]);

  const [currentPhoto, setCurrentPhoto] = React.useState(min);

  const queryClient = useQueryClient();
  const mutationDeleteUser = useMutation(deleteUserRequest, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('users');
    },
  });

  return (
    <div className="row">
      <div className="col-6">
        <div className="row">
          {user?.photos?.map((photo, i) => (
            <UserImageExcerpt
              key={photo.id}
              currentPhoto={currentPhoto}
              photo={photo}
              i={i}
              user={user}
            />
          ))}
        </div>

        <div className="row">
          <Stack spacing={4} direction="row" align="center">
            <Button
              colorScheme="teal"
              disabled={currentPhoto === min}
              onClick={() => {
                if (currentPhoto === min) return;
                setCurrentPhoto((curr) => curr - 1);
              }}
            >
              previous
            </Button>
            <Button
              colorScheme="teal"
              disabled={currentPhoto === max}
              onClick={() => {
                if (currentPhoto === max) return;
                setCurrentPhoto((curr) => curr + 1);
              }}
            >
              next
            </Button>
          </Stack>
        </div>
      </div>
      <div className="col-6">
        <div className="d-flex">
          <Button
            isLoading={mutationDeleteUser.isLoading}
            spinner={<BeatLoader size={8} color="white" />}
            className="ms-auto"
            variant="outline"
            onClick={() => {
              mutationDeleteUser.mutate({ uId: user.id });
            }}
          >
            delete
          </Button>
        </div>
        <div>
          <div className="">first name: {user?.firstName}</div>
          <div className="">last name: {user?.lastName}</div>
          <div className="">isActive: {user?.isActive ? 'active' : 'not active'}</div>
          <div className="">
            <TimeAgo timeStamp={user?.createdAt}></TimeAgo>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserImageExcerpt({
  currentPhoto,
  user,
  photo,
  i,
}: {
  currentPhoto: number;
  user: User;
  photo: PublicFile;
  i: number;
}) {
  return currentPhoto === i ? (
    <Fade className="col-12" in={true}>
      <Image
        boxSize="sm"
        rounded="md"
        objectFit="cover"
        src={photo.expiredUrl}
        alt={`${user.firstName} photo' ${i} `}
        fallbackSrc="https://via.placeholder.com/150"
      />
      <TimeAgo timeStamp={photo.createdAt}></TimeAgo>
    </Fade>
  ) : null;
}
