import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { User } from '../types';
import { BeatLoader } from 'react-spinners';

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  file?: any;
};

const addUserPostRequest = async (addUserDtoFormData: FormData): Promise<User> => {
  const { data } = await axios.post('http://localhost:3000/users', addUserDtoFormData);
  return data;
};

const AddUser = () => {
  const initialVals: CreateUserDto = { firstName: '', lastName: '' };
  const [selectedFile, setSelectedFiles] = React.useState<File>();

  const queryClient = useQueryClient();
  const mutation = useMutation(addUserPostRequest, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('users');
    },
  });

  return (
    <div className="row">
      <Formik
        initialValues={initialVals}
        validate={(values) => {
          const errors: Partial<CreateUserDto> = {};
          if (!values.firstName) {
            errors.firstName = 'Required';
          }
          if (!values.lastName) {
            errors.lastName = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
          });
          if (selectedFile) formData.append('file', selectedFile, selectedFile?.name);
          mutation.mutate(formData);
        }}
      >
        {(props) => (
          <Form className="row">
            <Field className="col-12" type="text" name="firstName">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                  <FormLabel htmlFor="firstName">First name</FormLabel>
                  <Input {...field} id="firstName" />
                  <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field className="col-12" type="text" name="lastName">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                  <FormLabel htmlFor="lastName">Last name</FormLabel>
                  <Input {...field} id="lastName" />
                  <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <div className="col-12">
              <FormControl>
                <FormLabel htmlFor="user-file"></FormLabel>
                <Input
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;

                    setSelectedFiles(files[0]);
                  }}
                  type="file"
                  id="user-file"
                  multiple={false}
                />
              </FormControl>
            </div>

            <div className="col-12 mt-2">
              <div className="row">
                <div className="col-auto ms-auto">
                  <Button
                    isLoading={mutation.isLoading}
                    spinner={<BeatLoader size={8} color="white" />}
                    colorScheme="teal"
                    type="submit"
                    disabled={!!Object.keys(props.errors).length}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddUser;
