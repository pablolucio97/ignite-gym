import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { useNavigation } from '@react-navigation/native'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack
} from 'native-base'

export function SignUp() {

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1
      }}
    >
      <VStack
        flex={1}
        bgColor='gray.700'
        px={8}
      >
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='pessoas treinando'
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg />
          <Text
            color='gray.100'
          >
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color='gray.100'
            fontSize='xl'
            mb={6}
            fontFamily='heading'
          >
            Crie sua conta
          </Heading>
          <Input
            placeholder='Nome'
          />
          <Input
            placeholder='E-mail'
            autoCapitalize='none'
            keyboardType='email-address'
          />
          <Input
            placeholder='Senha'
            secureTextEntry
          />
          <Button
            title='Criar e acessar'
            mb={12}
          />
          <Button
            onPress={handleGoBack}
            title='Voltar para login'
            variant='outline'
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}