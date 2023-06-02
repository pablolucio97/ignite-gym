import { VStack, Image, Text, Center, Heading } from 'native-base'
import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'

export function SignIn() {
  return (
    <VStack
      flex={1}
      bgColor='gray.700'
      px={8}
    >
      <Image
        source={BackgroundImg}
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
          Acesse sua conta
        </Heading>
        <Input
          placeholder='E-mail'
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <Input
          placeholder='Senha'
          secureTextEntry
        />
      </Center>


    </VStack>
  )
}