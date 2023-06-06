import { HStack, VStack, Text, Heading, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
    return (
        <HStack
            bg='gray.600'
            pt={16}
            pb={5}
            px={8}
            alignItems='center'
        >
            <UserPhoto
                source={{ uri: 'https://github.com/pablolucio97.png' }}
                size={16}
                alt="Imagem do usuário"
                mr={4}
            />
            <VStack
                flex={1}
            >
                <Text
                    color='gray.100'
                    fontSize='md'
                >
                    Olá,
                </Text>
                <Heading
                    color='gray.100'
                    fontSize='md'
                >
                    Pablo
                </Heading>
            </VStack>
            <TouchableOpacity>
                <Icon
                    as={MaterialIcons}
                    name='logout'
                    size={7}
                    color='gray.200'
                />
            </TouchableOpacity>
        </HStack>
    )
}