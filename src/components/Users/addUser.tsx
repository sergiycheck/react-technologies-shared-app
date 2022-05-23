import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { User } from '../types';
import { BeatLoader } from 'react-spinners';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  [`file[]`]?: any;
};
const maxFilesCountToUploadAtOnce = 10;

const addUserPostRequest = async (addUserDtoFormData: FormData): Promise<User> => {
  const { data } = await axios.post('http://localhost:3000/users', addUserDtoFormData);
  return data;
};

const AddUser = () => {
  const initialVals: CreateUserDto = { firstName: '', lastName: '' };
  const [selectedFiles, setSelectedFiles] = React.useState<File[] | null>();
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation(addUserPostRequest, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('users');
    },
  });

  const fileChangeHandler = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) continue;

      setSelectedFiles((filesPrev) => {
        const res = filesPrev ? [...filesPrev, files[i]] : [files[i]];
        return res;
      });
    }
  };

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
        onSubmit={async (values, helpers) => {
          const formData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
          });
          if (selectedFiles?.length) {
            selectedFiles.forEach((selectedFile) => {
              formData.append('file[]', selectedFile, selectedFile?.name);
            });
          }
          await mutation.mutateAsync(formData);
          helpers.resetForm();
          setSelectedFiles(null);
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
                <FormLabel htmlFor="user-file-select">Select some photos</FormLabel>
                <Box
                  w="100%"
                  p={20}
                  my={2}
                  border="2px dashed"
                  borderRadius="md"
                  borderColor="cyan.700"
                  onDragEnter={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDragOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const dataTrasfer = e.dataTransfer;
                    const files = dataTrasfer.files;
                    if (!files) return;
                    if (files.length > maxFilesCountToUploadAtOnce) return;
                    fileChangeHandler(files);
                  }}
                >
                  <Button
                    colorScheme="cyan"
                    id="user-file-select"
                    onClick={(e) => {
                      e.preventDefault();
                      if (inputFileRef?.current) {
                        inputFileRef?.current?.click();
                      }
                    }}
                  >
                    <AddIcon w={6} h={6} />
                  </Button>
                </Box>

                <Input
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    if (files.length > maxFilesCountToUploadAtOnce) return;

                    fileChangeHandler(files);
                  }}
                  ref={inputFileRef}
                  type="file"
                  display="none"
                  id="user-file"
                  multiple={true}
                />
              </FormControl>
            </div>

            <div className="col-12 mt-2">
              <div className="row">
                {selectedFiles &&
                  selectedFiles.map((selectedFile, i) => {
                    return (
                      <div key={i} className="col-12">
                        <PhotoPreviewExcerpt
                          file={selectedFile}
                          setSelectedFiles={setSelectedFiles}
                        />
                      </div>
                    );
                  })}
              </div>
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

export const PhotoPreviewExcerpt = ({
  file,
  setSelectedFiles,
}: {
  file: File;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[] | null | undefined>>;
}) => {
  const fileReaderRef = React.useRef<FileReader>();

  const [photoSrc, setPhotoSrc] = React.useState<string>();

  React.useEffect(() => {
    fileReaderRef.current = new FileReader();
    const fileReader = fileReaderRef.current;

    function handleEvent(ev: ProgressEvent<FileReader>) {
      if (fileReader.result) {
        const photoSrc = fileReader.result as unknown as string;
        setPhotoSrc(photoSrc);
      }
    }

    if (fileReader.readyState === FileReader.EMPTY) {
      fileReader.readAsDataURL(file);
    }

    fileReader.addEventListener('load', handleEvent);

    return () => {
      fileReader.removeEventListener('load', handleEvent);
    };
  }, [file]);

  return (
    <Box position="relative" p="2" mt={10}>
      <Button
        position="absolute"
        right="-10"
        top="-10"
        onClick={(e) => {
          setSelectedFiles((prevFiles) => prevFiles?.filter((f) => f.name !== file.name));
        }}
      >
        <CloseIcon></CloseIcon>
      </Button>
      <Image
        boxSize="sm"
        rounded="md"
        objectFit="cover"
        src={photoSrc}
        alt={`${file.name}`}
        fallbackSrc="https://via.placeholder.com/150"
      />
    </Box>
  );
};

export default AddUser;
