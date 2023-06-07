import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
    Center,
    ScrollView,
    VStack,
    Skeleton,
    Text,
    Heading
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'

export function Profile() {

    const PHOTO_SIZE = 32

    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [photoUri, setPhotoUri] = useState('')

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
                setPhotoUri(selectedPhoto.assets[0].uri)
            }

        } catch (error) {
            console.log(error)
            setPhotoIsLoading(false)
        } finally {
            setPhotoIsLoading(false)
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


                    <Input
                        bg="gray.600"
                        placeholder='Nome'
                    />

                    <Input
                        bg="gray.600"
                        placeholder="E-mail"
                        isDisabled
                    />

                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" mb={2}>
                        Alterar senha
                    </Heading>

                    <Input
                        bg="gray.600"
                        placeholder="Senha antiga"
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Nova senha"
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                    />

                    <Button title="Atualizar" mt={4} />
                </VStack>
            </ScrollView>
        </VStack>
    )
}