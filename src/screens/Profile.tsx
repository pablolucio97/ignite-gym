import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
    Center,
    Heading,
    ScrollView,
    Skeleton,
    Text,
    VStack,
    useToast
} from "native-base";
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity } from "react-native";
import * as yup from 'yup';

type FormDataProps = {
    name: string;
    email: string;
    old_password: string;
    password: string | null | undefined;
    confirm_password: string | null | undefined;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email'),
    old_password: yup.string().required('Informe a senha antiga'),
    //PASSWORD CAN BE OR NOT INFORMED, IF NOT SENDS A NULL VALUE
    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 dígitos.')
        .nullable()
        .transform((value) => !!value ? value : null),
    //PASSWORD CONFIRMATION MUST BE EQUALS PASSWORD AND CAN BE OR NOT INFORMED, IF NOT SENDS A NULL VALUE
    //GRANT FORM WILL BE SENT ONLY IF PASSWORD CONFIRMATION IS TYPED
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => (!!value ? value : null))
        .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.')
        .transform((value) => !!value ? value : null)
        .when('password', {
            is: (Field: any) => Field,
            then: (schema) =>
                schema.nullable().required('Informe a confirmação da senha.'),
        }),
})

export function Profile() {

    const PHOTO_SIZE = 32

    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [photoUri, setPhotoUri] = useState('')
    const [isUpdating, setIsUpdating] = useState(false);

    const toast = useToast()
    const { user, updateUserProfile } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        //@ts-ignore
        resolver: yupResolver(profileSchema)
    })

    async function handleSelectUserPhoto() {
        try {
            setPhotoIsLoading(true)
            const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
            });

            if (selectedPhoto.canceled) {
                return
            }

            if (selectedPhoto.assets[0].uri) {
                const fileInfo = await FileSystem
                    .getInfoAsync(selectedPhoto.assets[0].uri) as FileSystem.FileInfo

                if (fileInfo.size && (fileInfo.size / 1024 / 1024) > 2) {
                    return toast.show({
                        title: 'Escolha uma imagem com até 2 mb.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }

                setPhotoUri(selectedPhoto.assets[0].uri)
            }

        } catch (error) {
            console.log(error)
            setPhotoIsLoading(false)
        } finally {
            setPhotoIsLoading(false)
        }
    }

    async function handleUpdateProfile(data: FormDataProps) {
        try {
            setIsUpdating(true);

            const updatedUser = user
            updatedUser.name = data.name

            await api.put('/users', data);
            await updateUserProfile(updatedUser)

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />
            <ScrollView>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                width={PHOTO_SIZE}
                                height={PHOTO_SIZE}
                                rounded='full'
                                startColor='gray.400'
                                endColor='gray.600'
                            />
                            :
                            <UserPhoto
                                source={{
                                    uri: photoUri ? photoUri :
                                        'https://github.com/pablolucio97.png'
                                }}
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                            />
                    }

                    <TouchableOpacity
                        onPress={handleSelectUserPhoto}
                    >
                        <Text
                            color="green.500"
                            fontWeight="bold"
                            fontSize="md"
                            mt={2}
                            mb={8}
                        >
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>


                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors?.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="E-mail"
                                isDisabled
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors?.email?.message}
                            />

                        )}
                    />


                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" mb={2}>
                        Alterar senha
                    </Heading>
                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors?.old_password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors?.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Confirme a nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors?.confirm_password?.message}
                            />
                        )}
                    />

                    <Button
                        onPress={handleSubmit(handleUpdateProfile)}
                        title="Atualizar" mt={4}
                        isLoading={isUpdating}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    )
}